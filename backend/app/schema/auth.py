from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class OAuth2CallbackSchema(BaseModel):
    code: str
    state: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
