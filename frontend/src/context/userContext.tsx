"use client"
import React, { createContext, useContext, useState } from "react"

type AuthContextType = {
  isSignedup: boolean
  setIsSignedup: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignedup, setIsSignedup] = useState(false)

  return (
    <AuthContext.Provider value={{ isSignedup, setIsSignedup }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
