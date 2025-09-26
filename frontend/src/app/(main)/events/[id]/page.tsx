'use client'

import React from 'react'
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/userContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { id } = useParams();
    const { user } = useUser();
    const { events } = useAuth();
    const router = useRouter();

    const fetchEventDetails = events.find(event => event.id === parseInt(id));

    const handleClick = () => {
        if(!user) {
            alert("Please login first");
            router.push(`/userAuth/login`);
        }
        else{
            router.push(`/events/${id}`);
        }
    }

    return (
        <div>
            <div className='w-4/6 mx-auto flex flex-col justify-center gap-5'>
                <img src={`${fetchEventDetails?.image}`} alt={`Event ${id}`} width={200} height={"auto"} className='mt-10 mx-auto w-full border-2 h-auto' />
                <h1 className='text-4xl font-bold mt-5'>{fetchEventDetails?.title}</h1>
                <div className='flex flex-col gap-1'>
                    <p className='text-xl'>{fetchEventDetails?.date}{fetchEventDetails?.time}</p>
                    <p className='text-xl'>{fetchEventDetails?.location}</p>
                    <div className='flex gap-10 mt-5'>
                        <div className='flex flex-col'>
                            <div className='flex justify-between'>
                                <div className='w-4/6'>
                                    <p className='text-2xl font-semibold mt-2'>Event Info</p>
                                    <p className='text-lg' style={styles.description}>{fetchEventDetails?.description}</p>
                                </div>
                                <div>
                                    <div className='flex flex-col'>
                                        <img src={`${fetchEventDetails?.image}`} alt={`Event ${id}`} width={300} height={150} className='border-2 rounded-xl' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between mt-8'>
                                <div className='w-4/6'>
                                <p className='text-2xl font-semibold'>Tickets</p>
                                <div className='border-2 p-10 px-10 flex flex-col gap-3 mt-4 bg-gray-100 dark:bg-gray-900 rounded-xl w-4/6'>
                                    <h3 className='text-xl font-semibold'>Tickets Available</h3>
                                    <button onClick={() => handleClick(fetchEventDetails.id)} className='bg-blue-500 text-white rounded-md p-2 w-fit px-10'>Register/Book Now</button>
                                </div>
                                </div>
                                <div className=''>
                                    <h3 className='text-2xl font-semibold'>Related Events</h3>
                                    <div className='flex flex-col gap-3 mt-4'>
                                        <img src={`${fetchEventDetails?.image}`} alt={`Event ${id}`} width={300} height={150} className='border-2 rounded-xl' />
                                        <img src={`${fetchEventDetails?.image}`} alt={`Event ${id}`} width={300} height={150} className='border-2 rounded-xl' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    description: {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}

export default Page
