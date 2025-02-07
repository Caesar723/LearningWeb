from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import os

class Settings(BaseSettings):
    # 添加默认值
    database_url: str = "postgresql+asyncpg://default:password@localhost:5432/defaultdb"
    secret_key: str = "default-secret-key-for-dev"
    
    # 更新配置
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent.parent / ".env",  # 确保路径正确
        env_file_encoding='utf-8',
        extra='ignore'
    )

# 添加环境变量加载验证
print("Loading .env from:", Path(__file__).resolve().parent.parent.parent / ".env")
print("DATABASE_URL:", os.getenv('DATABASE_URL'))

settings = Settings()