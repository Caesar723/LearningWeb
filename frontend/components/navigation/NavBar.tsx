import Link from 'next/link'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Navigation({ user }: { user?: User | null }) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧导航链接 */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-xl font-bold text-blue-600">DeepSeek</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/learn">Learning</NavLink>
              <NavLink href="/progress">Progress</NavLink>
            </div>
          </div>

          {/* 右侧用户菜单 */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <span className="rounded-full h-8 w-8 bg-blue-100 flex items-center justify-center">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  )
}