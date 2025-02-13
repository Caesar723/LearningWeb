from fastapi import APIRouter, Depends, HTTPException, Response, Request,status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
import aioredis
import httpx
import uuid
from urllib.parse import urlencode
from datetime import datetime, timedelta
# from backend.app.core.security import get_password_hash
# from backend.app.models.schemas import UserCreate


if __name__ == "__main__":
    import sys
    sys.path.append("..")
from backend.app.models.schemas import User
from backend.app.models.database import DataBase,db,get_redis
from backend.app.core.config import settings
from backend.app.schema.auth import TokenResponse
from backend.app.core.oauth import get_google_userinfo, get_github_userinfo, get_wechat_userinfo

'''
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant OAuthProvider

    User->>Frontend: 点击"Google登录"
    Frontend->>Backend: GET /auth/oauth2/google/authorize
    Backend->>Frontend: 返回Google授权URL
    Frontend->>User: 重定向到Google
    User->>OAuthProvider: 登录并授权
    OAuthProvider->>Frontend: 重定向回前端回调URL?code=ABC&state=XYZ
    Frontend->>Backend: POST /auth/login?provider=google
    Backend->>OAuthProvider: 用code换token
    OAuthProvider->>Backend: 返回access_token
    Backend->>Backend: 创建本地会话
    Backend->>Frontend: 返回session cookie

'''


router = APIRouter(tags=["auth"])


async def create_session(user_id: str,redis_client:aioredis.Redis):
    session_id = str(uuid.uuid4())
    expires_at = datetime.now() + timedelta(minutes=30)
    session_data = {
        "user_id": user_id,
        "login_time": datetime.now().isoformat(),
        "expires_at": expires_at.isoformat(),
    }
    await redis_client.hset(session_id, mapping=session_data)
    await redis_client.expire(session_id, timedelta(minutes=30))

    return session_id

async def get_or_create_oauth_user(
    provider_id:str,
    provider:str,
    email:str,
    username:str,
    
)->User:
    result = await db.check_user_exists(provider,provider_id)
    if result:
        return result
    else:
        return await db.store_user_provider(username,email,provider,provider_id)
    
    

@router.post("/auth/login", response_model=TokenResponse)
async def login(
    response: Response, 
    request:Request,
    # 使用OAuth2标准表单接收用户名密码（仅password方式需要）
    form_data: OAuth2PasswordRequestForm = Depends(),
    provider: str = "password",
    redis_client: aioredis.Redis = Depends(get_redis)
    ):
    user_id = None
    user = None
    try:
        if provider == "password":
            pass
        elif provider in ("google","github","wechat"):
            pass
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported authentication provider: {provider}"
            )
    except HTTPException as e:
        if provider == "password" and user is None:
            print(f"Failed login attempt for username: {form_data.username}")
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during authentication"
        )
    user_id = "example_user_id"
    session_id = create_session(user_id, redis_client)
    
    # 设置 Cookie
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=1800,secure=True,samesite="lax")
    
    return {"message": "Login successful"}

@router.post("/auth/logout")
async def logout(
    response: Response, 
    request: Request,
    redis_client:aioredis.Redis = Depends(get_redis)
    ):
    session_id = request.cookies.get("session_id")
    if session_id:
        redis_client.delete(session_id)

    # 删除 Cookie
    response.delete_cookie("session_id")
    return {"message": "Logout successful"}

@router.get("/auth/oauth2/{provider}/authorize")
async def oauth2_authorize(
    provider: str,
    request: Request,
    redis: aioredis.Redis = Depends(get_redis)
):
    if provider not in ("google", "github","wechat"):
        raise HTTPException(status_code=400, detail="Invalid provider")
    
    # 生成随机状态码
    state = str(uuid.uuid4())
    # 存储状态码到 Redis
    await redis.set(f"oauth2_state:{state}", "pending", ex=300)

    base_urls = {
        "google": "https://accounts.google.com/o/oauth2/v2/auth",
        "github": "https://github.com/login/oauth/authorize",
        "wechat": "https://open.weixin.qq.com/connect/qrconnect"
    }


    params = {
        "google": {
            "response_type": "code",
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.REDIRECT_URI(provider),
            "scope": "openid email profile",
            "state": state
        },
        "github": {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": settings.REDIRECT_URI(provider),
            "scope": "user:email",
            "state": state
        },
        "wechat": {
            "response_type": "code",
            "appid": settings.WECHAT_APP_ID,
            "redirect_uri": settings.REDIRECT_URI(provider),
            "scope": "snsapi_login",
            "state": state
        }
    }
    auth_url = f"{base_urls[provider]}?{urlencode(params[provider])}"
    return RedirectResponse(auth_url)

# OAuth2回调端点
@router.get("/auth/oauth2/{provider}/callback", response_model=TokenResponse)
async def oauth2_callback(
    provider: str,
    code: str,
    state: str,
    redis: aioredis.Redis = Depends(get_redis)
):
    if await redis.get(f"oauth2_state:{state}")!=b"pending":
        raise HTTPException(status_code=400, detail="Invalid state")
    
    await redis.delete(f"oauth2_state:{state}")
    
    token_params = {
        "google": {
            "url": "https://oauth2.googleapis.com/token",
            "data": {
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.OAUTH_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        },
        "github": {
            "url": "https://github.com/login/oauth/access_token",
            "data": {
                "code": code,
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET
            },
            "headers": {"Accept": "application/json"}
        },
        "wechat": {
            "url": "https://api.weixin.qq.com/sns/oauth2/access_token",
            "data": {
                "code": code,
                "appid": settings.WECHAT_APP_ID,
                "secret": settings.WECHAT_APP_SECRET,
                "grant_type": "authorization_code"
            }
        }
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url=token_params[provider]["url"], 
                data=token_params[provider]["data"],
                headers=token_params[provider]["headers"]
            )
            response.raise_for_status()
            token_data = response.json()
            
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=400, detail=str(e))
    user_info_func = {
        "google": get_google_userinfo,
        "github": get_github_userinfo,
        "wechat": get_wechat_userinfo
    }
    user_info = await user_info_func[provider](token_data["access_token"])
    user = await get_or_create_oauth_user(
        provider_id=user_info["id"],
        provider=provider,
        email=user_info["email"],
        username=user_info["name"]
    )
    session_id = await create_session(str(user.id), redis)
    return {"access_token": session_id, "token_type": "bearer"}
# @router.post("/auth/register")
# async def register(user: UserCreate):
#     query = select(User).where(User.email == user.email)
#     existing_user = await database.fetch_one(query)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     hashed_password = get_password_hash(user.password)
#     query = User.__table__.insert().values(email=user.email, hashed_password=hashed_password)
#     await database.execute(query)
    
#     return {"message": "User registered successfully"}


