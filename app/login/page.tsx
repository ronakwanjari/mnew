"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, User, Shield, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent, userType: "patient" | "admin" | "doctor") => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)

      // Store user type in localStorage for demo purposes
      localStorage.setItem("userType", userType)
      localStorage.setItem("userEmail", email)

      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to ${userType} dashboard...`,
      })

      // Route based on user type
      switch (userType) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "doctor":
          router.push("/doctor/dashboard")
          break
        case "patient":
          router.push("/patient/dashboard")
          break
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <Bot className="h-8 w-8" />
            <span>MEDIBOT</span>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to your account</p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient" className="flex items-center space-x-1 text-xs">
              <User className="h-3 w-3" />
              <span>Patient</span>
            </TabsTrigger>
            <TabsTrigger value="doctor" className="flex items-center space-x-1 text-xs">
              <Stethoscope className="h-3 w-3" />
              <span>Doctor</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-1 text-xs">
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Patient Login</span>
                </CardTitle>
                <CardDescription>Access your AI health assistant and medical services</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, "patient")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      name="email"
                      type="email"
                      placeholder="ronakw.etc22@sbjit.edu.in"
                      defaultValue="ronakw.etc22@sbjit.edu.in"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" name="password" type="password" defaultValue="password123" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Patient"}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: ronakw.etc22@sbjit.edu.in
                    <br />
                    Password: password123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  <span>Doctor Login</span>
                </CardTitle>
                <CardDescription>Access your appointments and patient consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, "doctor")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Doctor Email</Label>
                    <Input
                      id="doctor-email"
                      name="email"
                      type="email"
                      placeholder="doctor@medibot.com"
                      defaultValue="dr.sarah@medibot.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input id="doctor-password" name="password" type="password" defaultValue="doctor123" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Doctor"}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: dr.sarah@medibot.com
                    <br />
                    Password: doctor123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Admin Login</span>
                </CardTitle>
                <CardDescription>Full system access - manage doctors, pharmacies, and platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      placeholder="admin@medibot.com"
                      defaultValue="admin@medibot.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input id="admin-password" name="password" type="password" defaultValue="admin123" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Admin"}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: admin@medibot.com
                    <br />
                    Password: admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {"Don't have an account? "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
