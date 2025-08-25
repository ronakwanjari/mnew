
"use client"

import { SignIn } from "@clerk/nextjs"
import { Bot } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
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

        <div className="flex justify-center">
          <SignIn 
            routing="hash"
            signUpUrl="/register"
            redirectUrl="/patient/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
