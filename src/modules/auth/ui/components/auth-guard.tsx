"use client";

import { Authenticated, Unauthenticated } from "better-convex/react"

import { AuthScreen } from "@/modules/auth/ui/screens/auth-screen";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Authenticated>
        {children}
      </Authenticated>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>
    </>
  )
}