'use client'

import React from 'react'
import { useAuth } from '@/context/UserContext'
import AdminProfile from '@/app/(main)/admin/page'
import UserProfile from '@/components/User/Profile'

const Page = () => {
  const { user } = useAuth();

  return (
    <div>
      {user?.role === "admin" ? (
        <AdminProfile />
      ) : (
        <UserProfile />
      )
      }
    </div>
  )
}

export default Page
