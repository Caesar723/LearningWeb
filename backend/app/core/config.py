from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Optional
import os

class Settings(BaseSettings):
    # 添加默认值
    database_url: str = "postgresql+asyncpg://default:password@localhost:5432/defaultdb"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "default-secret-key-for-dev"
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    WECHAT_APP_ID: Optional[str] = None
    WECHAT_APP_SECRET: Optional[str] = None
    OAUTH_REDIRECT_URI: str = "http://localhost:8000/auth/oauth2/{provider}/callback"
    # 更新配置
    model_config = SettingsConfigDict(
        env_file="backend/ .env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
        
    def REDIRECT_URI(self,provider:str):
        return self.OAUTH_REDIRECT_URI.format(provider=provider)

# 添加环境变量加载验证
# print("Loading .env from:", Path(__file__).resolve().parent.parent.parent / ".env")
# print("DATABASE_URL:", os.getenv('DATABASE_URL'))



settings = Settings()
print(settings.database_url)
print(settings.GOOGLE_CLIENT_ID)
print(settings.GOOGLE_CLIENT_SECRET)
print(settings.GITHUB_CLIENT_ID)
print(settings.GITHUB_CLIENT_SECRET)
print(settings.WECHAT_APP_ID)
print(settings.WECHAT_APP_SECRET)
print(settings.REDIRECT_URI("google"))
print(settings.redis_url)