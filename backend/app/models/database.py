from sqlalchemy import create_engine, MetaData,select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
import bcrypt
import aioredis

if __name__ == "__main__":
    import sys
    sys.path.append("..")

from backend.app.core.config import settings
from backend.app.models.schemas import User


async def get_redis() -> aioredis.Redis:
    return await aioredis.from_url(settings.REDIS_URL)


class DataBase:

    def __init__(self):
        print(settings.database_url)
        print("OKK")
        self.async_engine = create_async_engine(settings.database_url)
        self.AsyncSessionLocal: sessionmaker[AsyncSession] = sessionmaker(self.async_engine, class_=AsyncSession, expire_on_commit=False)
        print("OK")

    def hash_password(self,password:str):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    async def store_user_local(self,username:str,email:str,password:str):
        async with self.AsyncSessionLocal() as session:
            user = User(username=username,email=email,hashed_password=self.hash_password(password))
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user
    async def store_user_provider(self,username:str,email:str,provider:str,provider_id:str):
        async with self.AsyncSessionLocal() as session:
            user = User(username=username,email=email,provider=provider,provider_id=provider_id)
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user
    
    async def check_user_exists(self,provider:str,provider_id:str):
        async with self.AsyncSessionLocal() as session:
            user = await session.execute(
                select(User).where(User.provider == provider,User.provider_id == provider_id)
            )
        return user.scalar_one_or_none()

db=DataBase()


if __name__ == "__main__":
    print(db.hash_password("123456"))