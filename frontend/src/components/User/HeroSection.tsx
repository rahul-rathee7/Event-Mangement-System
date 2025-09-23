'use client';

import React, { useState, useEffect } from 'react'
import { Music, Shrub, Trophy, Monitor, Search, Book, PartyPopper } from 'lucide-react'
import { useRouter } from 'next/navigation';
import axios from 'axios'

const HeroSection = () => {
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
        <div>
            <div className='w-5/8 m-auto mt-20'>
            <div>
            <h1 className="font-semibold text-7xl dark:text-white text-center leading-[1.2]">Plan, Manage & Join <br /> Events Effortlessly</h1>
            <p className='text-center text-2xl mt-7'>Discover and book events near you in just one click</p>
        </div>
        <div className='flex justify-center gap-5 mt-10'>
            <button type='button' className='font-semibold bg-[#003161] dark:bg-white dark:text-black dark:hover:bg-white/80 hover:bg-[#003161]/80 text-white py-4 px-10 rounded-xl' onClick={() => router.push('/events')}>Explore Events</button>
        </div>
        <div className='mt-15'>
            <h3 className='text-3xl font-bold'>Event Categories</h3>
            <div className='grid grid-cols-4 gap-5 mt-5 h-60'>
                <div className='border-2 rounded-xl flex flex-col gap-3 items-center justify-center'>
                    <Music size={100} stroke='#003161' strokeWidth={2}/>
                    <p className='text-3xl font-semibold'>Music</p>
                </div>
                <div className='border-2 rounded-xl flex flex-col gap-3 items-center justify-center'>
                    <Shrub size={100} stroke='#003161' strokeWidth={2}/>
                    <p className='text-3xl font-semibold'>Cultural</p>
                </div>
                <div className='border-2 rounded-xl flex flex-col gap-3 items-center justify-center'>
                    <Trophy size={100} stroke='#003161' strokeWidth={2}/>
                    <p className='text-3xl font-semibold'>Sports</p>
                </div>
                <div className='border-2 rounded-xl flex flex-col gap-3 items-center justify-center'>
                    <Monitor size={100} stroke='#003161' strokeWidth={2}/>
                    <p className='text-3xl font-semibold'>Tech</p>
                </div>
            </div>
        </div>
        <div className='mt-20'>
            <h3 className='text-3xl font-bold'>Featured Events</h3>
            <div className='grid grid-cols-3 gap-5 mt-5'>
                {events.length !== 0 ? events.map((event, index) => (
                    index < 3 && (
                    <div key={index} className='border-2 rounded-xl p-5 mb-5'>
                        {event.image && (
                            <div className='mb-3 flex flex-col justify-between h-full'>
                                <img src={event.image} alt={event.title} className='w-full h-40 object-cover rounded-md' />
                                <h4 className='text-xl font-semibold mt-2'>{event.title}</h4>   
                                <p className='text-gray-600'>{event.date} - {event.location}</p>
                                <button className='mt-3 bg-[#003161] hover:bg-[#003161]/80 text-white py-2 px-4 rounded-lg self-start' onClick={() => router.push(`/events/${event.id}`)}>Book Now</button>
                            </div>
                        )}
                    </div>)
                )) : (
                    <p>No events found</p>
                )}
            </div>
        </div>
        <div className='mt-20'>
            <h3 className='text-3xl font-bold text-center'>How It Works</h3>
            <div className='grid grid-cols-3 gap-5 mt-5 h-40'>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <Search size={70} stroke='#003161' strokeWidth={2}/>
                    <p className='text-2xl font-semibold'>Browse Events</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <Book size={70} stroke='#003161' strokeWidth={2}/>
                    <p className='text-2xl font-semibold'>Register/Book</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <PartyPopper size={70} stroke='#003161' strokeWidth={2}/>
                    <p className='text-2xl font-semibold'>Attend & Enjoy</p>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default HeroSection
