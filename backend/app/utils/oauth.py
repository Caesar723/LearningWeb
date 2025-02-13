from httpx import AsyncClient

async def get_google_userinfo(access_token: str):
    async with AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        return resp.json()

async def get_github_userinfo(access_token: str):
    async with AsyncClient() as client:
        resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"}
        )
        return resp.json()