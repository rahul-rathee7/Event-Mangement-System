"use client"
import { ObjectSegment } from "framer-motion"
import React, { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'

type Event = {
  _id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  image: string
}

type AuthContextType = {
  isSignedup: boolean
  setIsSignedup: React.Dispatch<React.SetStateAction<boolean>>
  otp: number
  setOtp: React.Dispatch<React.SetStateAction<number>>
  userType: "user" | "organizer"
  setUserType: React.Dispatch<React.SetStateAction<"user" | "organizer">>
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignedup, setIsSignedup] = useState(false)
  const [otp, setOtp] = useState(0);
  const [userType, setUserType] = useState<"user" | "organizer">("user");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
        async function fetchEvents() {
            axios.get('http://localhost:5000/api/events/get-all')
                .then((response) => {
                    console.log(response.data.events);
                    setEvents(response.data.events);
                })
                .catch((error) => {
                    console.error('Error fetching events:', error);
                });
        }
        fetchEvents();
    }, [])

  return (
    <AuthContext.Provider value={{ isSignedup, setIsSignedup, otp, setOtp, userType, setUserType, events, setEvents}}>
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
