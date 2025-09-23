'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [events, setEvents] = useState([]);

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
    <div className='w-full min-h-[70vh]'>
    <div className='w-4/5 grid grid-cols-4 mx-auto gap-4 my-10'>
        {
            events.length > 0 ? (
                events.map((event) => (
                    <div key={event.id} className='rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-lg hover:shadow-black dark:hover:shadow-white hover:scale-90 transition duration-600 ease-in-out'>
                        <img src={event.image} alt={event.title} width={100} height={100} className='w-full h-40 border-2 rounded-lg'/>
                        <h1 className='text-xl font-bold'>{event.title}</h1>
                        <button className='bg-blue-500 text-white rounded-md p-2' onClick={() => router.push(`/events/${event.id}`)}>View Details</button>
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
