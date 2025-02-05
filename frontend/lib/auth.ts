import { cookies } from 'next/headers'

interface Session {
  user: {
    id: string
    name: string
    email: string
  } | null
}

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  // 实际项目中需验证session token
  return {
    user: sessionCookie ? { 
      id: 'mock-user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date(),
      updatedAt: new Date(),
      learningPreferences: {
        difficultyLevel: 'beginner',
        preferredLanguage: 'en',
      },
      emailVerified: true,
    } : null
  }
}