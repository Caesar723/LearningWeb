from fastapi import APIRouter, Depends, HTTPException, Response, Request,status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from backend.app.models.schemas import User
from backend.app.models.database import database
import aioredis
import uuid



from datetime import datetime, timedelta
# from backend.app.core.security import get_password_hash
# from backend.app.models.schemas import UserCreate



router = APIRouter()




def create_session(user_id: str,redis_client:aioredis.Redis):
    session_id = str(uuid.uuid4())
    expires_at = datetime.now() + timedelta(minutes=30)
    session_data = {
        "user_id": user_id,
        "expires_at": expires_at.isoformat(),
    }
    redis_client.hset(session_id, mapping=session_data)
    redis_client.expire(session_id, timedelta(minutes=30))
    return session_id

@router.post("/auth/login")
async def login(response: Response, redis_client: aioredis.Redis = Depends()):
    # 假设用户验证成功，user_id 是从数据库中获取的
    user_id = "example_user_id"
    session_id = create_session(user_id, redis_client)
    
    # 设置 Cookie
    response.set_cookie(key="session_id", value=session_id, httponly=True, max_age=1800,secure=True,samesite="lax")
    
    return {"message": "Login successful"}

@router.post("/auth/logout")
async def logout(response: Response, request: Request,redis_client:aioredis.Redis = Depends()):
    session_id = request.cookies.get("session_id")
    if session_id:
        redis_client.delete(session_id)

    # 删除 Cookie
    response.delete_cookie("session_id")
    return {"message": "Logout successful"}
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