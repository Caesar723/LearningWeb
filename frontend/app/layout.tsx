import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation/NavBar'
import AuthNavigation from '@/components/navigation/AuthNav'
import { getCurrentRouteGroup } from '@/lib/router-utils'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DeepSeek Learning Platform',
  description: 'AI-Powered Personalized Learning System',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const routeGroup = await getCurrentRouteGroup()
  const session = await getSession()

  // 路由守卫逻辑
  if (routeGroup === '(main)' && !session) {
    redirect('/login')
  }

  if (routeGroup === '(auth)' && session) {
    redirect('/dashboard')
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">

        {/* 主内容区域 */}
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}