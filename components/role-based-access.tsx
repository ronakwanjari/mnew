
"use client"

import { useUser } from "@clerk/nextjs"
import { ReactNode } from "react"

interface RoleBasedAccessProps {
  allowedRoles: Array<"admin" | "doctor" | "patient">
  children: ReactNode
  fallback?: ReactNode
}

export function RoleBasedAccess({ allowedRoles, children, fallback }: RoleBasedAccessProps) {
  const { user } = useUser()
  
  const userRole = user?.publicMetadata?.role as string || "patient"
  
  if (!allowedRoles.includes(userRole as any)) {
    return fallback || <div>Access Denied</div>
  }
  
  return <>{children}</>
}
