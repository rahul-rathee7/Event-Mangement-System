'use client'
import React from 'react'
import { SignOutButton } from '@clerk/nextjs'

type Props = {
    className: string
}

const NavDropDown = ({className}: Props) => {
  return (
    <div className={`absolute p-5 flex flex-col items-center gap-5 justify-center dark:text-black border-2 w-45 h-50 dark:border-white/40 border-black/40 -bottom-50 rounded-2xl right-25 ${className}`}>
      <button className='dark:bg-white bg-black/30 w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white'>Profile</button>
      <button className='dark:bg-white bg-black/30 w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white'>Settings</button>
      <SignOutButton className="dark:bg-white bg-black/30 w-full rounded-full py-1 dark:hover:bg-red-500 hover:bg-red-500 hover:text-white">Logout</SignOutButton>
    </div>
  )
}

export default NavDropDown
