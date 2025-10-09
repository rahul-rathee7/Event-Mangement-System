"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import {useRouter} from 'next/navigation'

type User = {
  id: string
  email: string,
  fullname: string,
  description: string,
  location: string,
  image: string,
  role: string
}

type SignInParams = {
  emailAddress: string
  password: string
}

type SignInResult = {
  status: "complete" | "needs_email_verification" | "needs_registration"
  token?: string
  userId?: string
}

type AuthContextType = {
  user: User | null
  useSignIn: {
    isLoaded: boolean
    create: (params: SignInParams) => Promise<SignInResult>
  }
  setActive: (params: { token: string }) => Promise<void>
  isSignedup: boolean
  setIsSignedup: React.Dispatch<React.SetStateAction<boolean>>
  otp: number
  setOtp: React.Dispatch<React.SetStateAction<number>>
  SignOutButton: () => void
  setProfileImage: (file: File) => Promise<void>
  EditUserDetails: () => void
  error: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [otp, setOtp] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [isSignedup, setIsSignedup] = useState(false)
  const [isLoaded, setIsLoaded] = useState(true)
  const [error, setError] = useState('');
  const router = useRouter();

  const setActive = async ({ token }: { token: string }) => {
    localStorage.setItem('sessionToken', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    try {
      const userResponse = await axios.get(`${process.env.BACKEND_API_KEY}/users/profile`)
      setUser(userResponse.data.user)
    } catch (error) {
      console.error('Failed to fetch user profile after login:', error)
      localStorage.removeItem('sessionToken')
      setUser(null)
      throw new Error("Login failed: Could not fetch user details.")
    }
  }

  const signInClient = {
    isLoaded: isLoaded,
    create: async ({ emailAddress, password }: SignInParams): Promise<SignInResult> => {
      try {
        const response = await axios.post(`http://localhost:5000/api/auth/login`, {
          email: emailAddress,
          password: password,
        }, { withCredentials: true })
        if (response.status === 200 && response.data.token) {
          const { ...rest } = response.data.user;
          const formattedUser = { ...rest };
          setUser(formattedUser);
          console.log(formattedUser);
          return { status: "complete" };
        }
        else {
          setError(response.data.message || "Login failed")
        }

        if (response.data.needsVerification) {
          return { status: "needs_email_verification" }
        }

        if (response.data.userNotFound) {
          return { status: "needs_registration" }
        }

        throw new Error(response.data.message || "An unexpected error occurred.")

      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401 || error.response.status === 400) {
            throw new Error(error.response.data.message || "Invalid email or password.")
          }
        }
        throw error
      }
    }
  }

  const SignOutButton = async () => {
    await axios.get("http://localhost:5000/api/auth/logout");
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const EditUserDetails = async ({fullname, description, location}) => {
    try{
    const res = await axios.post(`http://localhost:5000/api/users`, { email: user?.email, fullname: fullname, description: description, location: location });
      if (res.data.success) {
        setUser((prev) => prev ? {...prev, fullname: res.data.fullname, description: res.data.description, location: res.data.location} : prev);
      }
      else{
        alert(res.data.message);
      }
    }
    catch(err) {
      console.error(err);
    }
}

useEffect(() => {
  async function fetchUserFromToken() {
    try{
      const res = await axios.get('http://localhost:5000/api/auth/get-cookie', { withCredentials: true });
      if(res.data.success) {
        setUser(res.data.user);
      }
    }
    catch(err: any) {
      if(err.response) {
        console.log(err.response.data.message);
      }
      else{
        console.error(err);
      }
    }
    }
  fetchUserFromToken()
}, [])

const setProfileImage = async ( fileInputRef: React.RefObject<HTMLInputElement>) => {
  const file = fileInputRef.current?.files?.[0];
  if(!file) return;
  setUser((prev) => prev ? {...prev, image: file.name} : prev);
}

return (
  <AuthContext.Provider value={{
    user,
    useSignIn: signInClient,
    error,
    setActive,
    otp,
    setOtp,
    isSignedup,
    setIsSignedup,
    SignOutButton,
    setProfileImage,
    EditUserDetails
  }}>
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