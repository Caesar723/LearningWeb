from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
import bcrypt

if __name__ == "__main__":
    import sys
    sys.path.append("..")

from backend.app.core.config import settings


class DataBase:
    def __init__(self):
        self.async_engine = create_async_engine(settings.database_url)
        self.AsyncSessionLocal = sessionmaker(self.async_engine, class_=AsyncSession, expire_on_commit=False)

    def hash_password(self,password:str):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

db=DataBase()
if __name__ == "__main__":
    print(db.hash_password("123456"))