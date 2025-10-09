'use client'
import React from 'react'
import { useAuth } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

type Props = {
    className: string
}

const NavDropDown = ({className}: Props) => {
  const { SignOutButton } = useAuth();
  const router = useRouter();

  return (
    <div className={`absolute p-5 flex flex-col items-center gap-5 justify-center dark:text-black border-2 w-45 h-50 dark:border-white/40 border-black/40 top-15 rounded-2xl -left-10 ${className}`}>
      <button onClick={() => router.push('/profile')} className='dark:bg-white bg-black dark:text-black dark:hover:text-white text-white w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white'>Profile</button>
      <button className='dark:bg-white bg-black dark:text-black dark:hover:text-white text-white w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white'>Settings</button>
      <button className="dark:bg-white bg-black dark:text-black dark:hover:text-white text-white w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white">Logout</button>
    </div>
  )
}

export default NavDropDown
