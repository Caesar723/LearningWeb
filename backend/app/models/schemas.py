from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from backend.app.models.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    hashed_password = Column(String(255))  # 仅密码登录需要
    email = Column(String(100), unique=True)
    provider = Column(String(20))  # local/google/github
    provider_id = Column(String(255))  # 第三方用户ID

class TreeNode(Base):
    __tablename__ = "tree_nodes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    content = Column(JSON)

class LearningSpace(Base):
    __tablename__ = "learning_spaces"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    content = Column(JSON)

class QuestionSpace(Base):
    __tablename__ = "question_spaces"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    content = Column(JSON)