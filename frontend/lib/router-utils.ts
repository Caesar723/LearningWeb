import { headers } from 'next/headers'

export async function getCurrentRouteGroup() {
  const headersList = await headers()
  const path = headersList.get('x-invoke-path') || ''
  
  if (path.startsWith('/login') || path.startsWith('/register')) {
    return '(auth)'
  }
  
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    return '(main)'
  }
  
  return '(main)' // 默认路由组
}