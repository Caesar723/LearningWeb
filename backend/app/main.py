
from dotenv import load_dotenv
load_dotenv(override=True)  # 添加在文件顶部

# 其他导入保持不变

from fastapi import FastAPI, Depends, HTTPException, Request,status
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
import os
import aioredis

from backend.app.core.config import settings
from backend.app.api.v1 import auth

app = FastAPI()
REDIS_URL = settings.redis_url
redis_client = aioredis.from_url(REDIS_URL)

class NotAuthenticatedException(Exception):
    pass

@app.exception_handler(NotAuthenticatedException)
async def auth_exception_handler(request: Request, exc: NotAuthenticatedException):
    return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)

@asynccontextmanager
async def startup():
    await redis_client.ping()
    yield
    await redis_client.close()

def get_session(session_id: str):
    session_data = redis_client.hgetall(session_id)
    if not session_data:
        return None
    return session_data


def check_login(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return None

    session_data = get_session(session_id)
    if not session_data:
        return None

    return session_data["user_id"]


def get_current_user(request: Request):
    user_id = check_login(request)
    if not user_id:
        raise NotAuthenticatedException()
    return user_id


app.include_router(auth.router, prefix="/api/v1", tags=["auth"], dependencies=[Depends(lambda: redis_client)])