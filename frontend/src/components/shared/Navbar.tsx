'use client'
import React, { useState } from 'react'
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import FlipLink from "@/components/ui/text-effect-flipper"
import ThemeToggleButton from '../ui/theme-toggle-button'
import NavDropDown from '../NavDropDown'

const Navbar = () => {
  const { user } = useUser();
  const [isdropDown, setIsdropdown] = useState(false);
  const router = useRouter();

  return (
      <div className='flex mt-3 sticky top-3 bg-transparent justify-between items-center h-16 border-2 dark:border-white/40 border-black/40 rounded-full mx-auto w-11/12 px-10'>
          <h1 className='text-3xl font-bold'>Eventify</h1>
          <div className='flex h-full gap-2'>
            <div className='px-5 h-full hover:bg-red-500 hover:text-white flex items-center rounded-lg'><FlipLink className="font-light">Home</FlipLink></div>
            <div className='px-5 h-full hover:bg-red-500 hover:text-white flex items-center rounded-lg'><FlipLink className="font-light" href='/userAuth/login'>About</FlipLink></div>
            <div className='px-5 h-full hover:bg-red-500 hover:text-white flex items-center rounded-lg'><FlipLink className="font-light" href='/userAuth/register'>Contact</FlipLink></div>
          </div>
          <div className='flex gap-6 itmes-center'>
          {
            user?.fullName == null ? 
                <button onClick={() => router.push('/userAuth/login')} className='flex px-5 py-2 rounded-lg bg-red-500 text-white justify-center items-center gap-2'>
                  Login
                </button>
            :
                <div className='flex items-center gap-3'>
                  <div className='flex gap-1'>
                    <FlipLink>{user?.firstName}</FlipLink>
                  </div>
                    <button onClick={() => setIsdropdown(!isdropDown)}><img src={user?.imageUrl} alt={user?.fullName} className='w-10 h-10 rounded-full' /></button>
                    <NavDropDown className={`${isdropDown ? 'block' : 'hidden'}`}/>
                </div>
          }
          <ThemeToggleButton />
          </div>
      </div>
  )
}

export default Navbar;
