"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"
import { toast } from 'sonner';

type User = {
  _id: string
  email: string,
  fullname: string,
  description: string,
  location: string,
  image: string,
  role: string,
  twoFA: boolean,
  phone: number
  registered_events: string
}

type SignInParams = {
  emailAddress: string
  password: string
}

type SignInResult = {
  status: "complete" | "needs_email_verification"
  token?: string
  userId?: string
}

type SignUpParams = {
  emailAddress: string
  password: string
  fullname: string
  role: string
}

type SignUpResult = {
  status: "complete" | "needs_email_verification"
  token?: string
  userId?: string
}

type AuthContextType = {
  user: User | null
  useSignIn: {
    isLoaded: boolean
    create: (params: SignInParams) => Promise<SignInResult>
  }
  useSignUp: {
    isLoaded: false
    create: (params: SignUpParams) => Promise<SignUpResult>
    update: (params: { fullname: string }) => Promise<void>
    prepareEmailAddressVerification: (params: { strategy: string }) => Promise<void>
  }
  isSignedup: boolean
  setIsSignedup: React.Dispatch<React.SetStateAction<boolean>>
  datafetched: boolean
  otp: number
  setOtp: React.Dispatch<React.SetStateAction<number>>
  SignOutButton: () => void
  setProfileImage: (file: File) => Promise<void>
  EditUserDetails: (...rest) => void
  error: string
  enableTwoFA: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isSignedup, setIsSignedup] = useState(false)
  const [datafetched, setDatafetched] = useState(false);
  const [otp, setOtp] = useState<number>(0);
  const [error] = useState<string>("");
  const router = useRouter()

  const signInClient = {
    isLoaded: true,
    create: async ({ emailAddress, password }: SignInParams): Promise<SignInResult> => {
      try {
        const response = await axios.post(`https://event-mangement-system-r4iu.onrender.com/api/auth/login`, {
          email: emailAddress,
          password: password,
        }, { withCredentials: true })
        if (response.status === 200 && response.data.token) {
          const { ...rest } = response.data.user;
          const formattedUser = { ...rest };
          setUser(formattedUser);
          console.log(formattedUser);
          return { status: !formattedUser.twoFA ? "complete" : "needs_email_verification" };
        }

        if (response.data.needsVerification) {
          return { status: "needs_email_verification" }
        }

        throw new Error(response.data.message || "An unexpected error occurred.")

      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401 || error.response.status === 400) {
            throw new Error(error.response.data.message || "Invalid email or password.")
          }
        }
        throw error
      }
    }
  }

  const signUpClient = {
    isLoaded: false as const,
    create: async ({ emailAddress, password, fullname, role }: SignUpParams): Promise<SignUpResult> => {
      setIsSignedup(true);
      try {
        const response = await axios.post(`https://event-mangement-system-r4iu.onrender.com/api/auth/register`, {
          email: emailAddress,
          password: password,
          fullname: fullname,
          role: role
        }, { withCredentials: true })
        if (response.status && response.data.token) {
          const { id, email, fullname, ...rest } = response.data.user;
          const formattedUser = { id, email, fullname, ...rest };
          setUser(formattedUser);
          if(response.data.message) {
            alert(response.data.message)
          }
          router.push("/");
          return { status: "complete" };
        }

        if (response.data.needsVerification) {
          return { status: "needs_email_verification" }
        }

        throw new Error(response.data.message || "An unexpected error occurred.")

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401 || error.response.status === 400) {
            throw new Error(error.response.data.message || "Invalid email or password.")
          }
        }
        throw error
    }
    finally {
      setIsSignedup(false);
    }
    },
    update: async () => {
      // Dummy implementation, replace with actual logic if needed
      return Promise.resolve();
    },
    prepareEmailAddressVerification: async () => {
      // Dummy implementation, replace with actual logic if needed
      return Promise.resolve();
    }
  }

  const SignOutButton = async () => {
    await axios.get("https://event-mangement-system-r4iu.onrender.com/api/auth/logout", {withCredentials: true});
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    router.push("/");
  }

  const EditUserDetails = async ({fullname, description, location, phone}) => {
    try{
    const res = await axios.post(`https://event-mangement-system-r4iu.onrender.com/api/users`, { email: user?.email, fullname: fullname, description: description, location: location, phone: phone }, { withCredentials: true });
      if (res.data.success) {
        setUser((prev => prev ? {...prev, fullname: res.data.fullname, description: res.data.description, location: res.data.location, phone: res.data.phone} : prev));
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
      const res = await axios.get('https://event-mangement-system-r4iu.onrender.com/api/auth/get-cookie', { withCredentials: true });
      if(res.data.success) {
        setUser(res.data.user);
        setDatafetched(true);
      }
    }
    catch(err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setDatafetched(true);
      }
      else{
        console.error(err);
        setDatafetched(true);
      }
    }
    }
  fetchUserFromToken()
}, [])

const setProfileImage = async (file: File) => {
  if (!file) return;
  setUser((prev) => prev ? { ...prev, image: file.name } : prev);
}

const enableTwoFA = async () => {
  setUser((prev) => prev ? {...prev, twoFA: !prev.twoFA} : prev);
  try{
    const res = await axios.post('https://event-mangement-system-r4iu.onrender.com/api/users/enable-two-factor', {email: user?.email, inp: !user?.twoFA}, { withCredentials: true });
    if(res.data.success) {
      setUser((prev) => prev ? {...prev, twoFA: res.data.two_factor} : prev);
      toast.success(`Two-Factor Authentication ${!user?.twoFA ? 'Enabled' : 'Disabled'}`);
    }
    else{
      if(res.status){
        toast.error("disabled");
      }
    }
  }
  catch(err) {
    console.log(err);
    toast.error(err.message || "Something went wrong");
  }
}

return (
  <AuthContext.Provider value={{
    user,
    useSignIn: signInClient,
    useSignUp: signUpClient,
    isSignedup,
    setIsSignedup,
    SignOutButton,
    setProfileImage,
    EditUserDetails,
    datafetched,
    otp,
    setOtp,
    error,
    enableTwoFA
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