// app/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

// 根路径自动跳转逻辑
export default async function HomePage() {
  const session = await getSession()

  // 根据登录状态跳转到不同页面
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}