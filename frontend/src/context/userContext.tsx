"use client"
import React, { createContext, useContext, useState } from "react"

type AuthContextType = {
  isSignedup: boolean
  setIsSignedup: React.Dispatch<React.SetStateAction<boolean>>
  otp: number
  setOtp: React.Dispatch<React.SetStateAction<number>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignedup, setIsSignedup] = useState(false)
  const [otp, setOtp] = useState(0);

  return (
    <AuthContext.Provider value={{ isSignedup, setIsSignedup, otp, setOtp }}>
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
