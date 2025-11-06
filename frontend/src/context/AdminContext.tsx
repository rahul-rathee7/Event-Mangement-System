"use client"
import React, { createContext, useContext, useState } from "react"

type AdminContextType = {
  datafetched: boolean
  error: string
}

const AdminContext = createContext<AdminContextType | null>(null)

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState('');
  const [datafetched, setDatafetched] = useState(false);

return (
  <AdminContext.Provider value={{
    error,
    datafetched
  }}>
    {children}
  </AdminContext.Provider>
)
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}