import { Link } from 'lucide-react'
import NavLink from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-10 justify-center items-center h-screen'>
      <h1 className='text-4xl md:text-6xl xl:text-8xl'>404-Page not found</h1>
      <NavLink href={'/'} className='flex gap-1 text-2xl underline hover:text-indigo-600 items-center'><Link />Go Back to Home</NavLink>
    </div>
  )
}

export default NotFound
