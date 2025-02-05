"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import SocialLogin from "./SocialLogin"

interface LoginFormProps {
  isRegister?: boolean
}

export default function LoginForm({ isRegister = false }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister) {
      // 在这里处理注册逻辑
      console.log("Register attempt with:", { email, password, confirmPassword })
    } else {
      // 在这里处理登录逻辑
      console.log("Login attempt with:", { email, password })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister ? "Please fill in your details to register" : "Please sign in to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {isRegister ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <div className="mt-6">
          <Separator className="my-4" />
          <SocialLogin isRegister={isRegister} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          {isRegister ? "Already have an account? Sign in" : "Forgot password?"}
        </a>
      </CardFooter>
    </Card>
  )
}

