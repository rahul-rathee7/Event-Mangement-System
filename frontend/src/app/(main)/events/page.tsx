'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/context/userContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const { events, setEvents } = useAuth();

  return (
    <div className='w-full min-h-[70vh]'>
    <div className='w-4/5 grid grid-cols-4 mx-auto gap-4 my-10'>
        {
            events.length > 0 ? (
                events.map((event, index) => (
                    <div key={index} onClick={() => router.push(`/events/${event.id}`)} className='rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-lg hover:shadow-black dark:hover:shadow-white hover:scale-90 transition duration-600 ease-in-out'>
                        <img src={event.image} alt={event.title} width={100} height={100} className='w-full h-40 border-2 rounded-lg'/>
                        <h1 className='text-xl font-bold'>{event.title}</h1>
                    </div>
                ))
            ) : (
                <h1>No events found</h1>
            )
        }
    </div>
    </div>
  )
}

export default Page
