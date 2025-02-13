import httpx
from fastapi import HTTPException

async def get_google_userinfo(access_token: str) -> dict:
    """
    通过Google access_token获取用户信息
    官方API文档：https://developers.google.com/identity/protocols/oauth2/openid-connect#obtainuserinfo
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Google API error: {e.response.text}"
        )

async def get_github_userinfo(access_token: str) -> dict:
    """
    增强版GitHub用户信息获取，处理邮箱获取问题
    官方文档说明：https://docs.github.com/en/rest/users/emails
    """
    try:
        async with httpx.AsyncClient() as client:
            # 基础用户信息
            user_resp = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                }
            )
            user_resp.raise_for_status()
            user_data = user_resp.json()

            # 单独获取邮箱信息（需要user:email权限）
            email_resp = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                }
            )
            
            if email_resp.is_success:
                emails = email_resp.json()
                # 优先选择已验证的主邮箱
                primary_email = next(
                    (e["email"] for e in emails if e["primary"] and e["verified"]),
                    None
                )
                # 次选第一个已验证邮箱
                verified_email = next(
                    (e["email"] for e in emails if e["verified"]),
                    None
                )
                user_data["email"] = primary_email or verified_email or None
                user_data["emails"] = emails  # 保留全部邮箱信息
            else:
                user_data["email"] = user_data.get("email", None)

            # 邮箱不存在时的处理
            if not user_data.get("email"):
                raise HTTPException(
                    status_code=400,
                    detail="No verified email found, please check your GitHub account settings"
                )

            return user_data
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=400,
            detail=f"GitHub API error: {e.response.text}"
        )
    

async def get_wechat_userinfo(access_token: str, openid: str) -> dict:
    """
    获取微信用户信息
    官方文档：https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html
    """
    try:
        async with httpx.AsyncClient() as client:
            # 获取用户信息
            response = await client.get(
                "https://api.weixin.qq.com/sns/userinfo",
                params={
                    "access_token": access_token,
                    "openid": openid
                    
                }
            )
            response.raise_for_status()
            data = response.json()
            
            if 'errcode' in data and data['errcode'] != 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"WeChat API error: {data.get('errmsg', 'Unknown error')}"
                )
                
            return {
                "openid": data["openid"],
                "id": data.get("unionid"),
                "name": data.get("nickname"),
                "avatar": data.get("headimgurl"),
                "email": f"{data['nickname']}@wechat.user"  # 微信不提供真实邮箱，使用虚拟邮箱
            }
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=400,
            detail=f"WeChat API error: {e.response.text}"
        )