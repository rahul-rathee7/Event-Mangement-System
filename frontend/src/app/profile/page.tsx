'use client'

import React, {useEffect, useState} from 'react'
import { useUser } from '@clerk/nextjs'
import EditProfile from '@/components/EditProfile'
import { Star } from 'lucide-react'
import axios from 'axios'

const Page = () => {
  const { user } = useUser();
  const [editProfile, seteditProfile] = useState(false);
  const [Name, setName] = useState('');
  const [description, setdescription] = useState('');
  const [location, setlocation] = useState('');

  const updateProfile = (e) => {
    e.preventDefault();
    seteditProfile(!editProfile);
  }

  useEffect(() => {
    const timeoutId = setTimeout( async () => {
      await axios.post('http://localhost:5000/api/users', { email: user?.emailAddresses[0].emailAddress }).then((res) => {
        if(res.data.success) {
            setName(res.data.User.fullname? res.data.User.fullname : (res.data.User.firstname ? res.data.User.firstname : res.data.User.lastname));
            setdescription(res.data.User[0].description ? res.data.User[0].description : 'Description');
            setlocation(res.data.User[0].location ? res.data.User[0].location : 'Location');
        }
        else if(res.data.success) {
          alert(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
      })
    }, 1000)
    return () => clearTimeout(timeoutId);
  },[user, editProfile])

  return (
    <div>
      <div>
        <div className='md:p-10 md:w-3/5 m-auto md:mt-10 md:px-20 px-5 rounded-lg bg-white text-black justify-between'>
        <div className='flex flex-col xl:flex-row items-center gap-8'>
          <div className='mt-10 md:mt-0 border-2 w-fit rounded-full border-red-500 p-[0.2rem] row-span-2 self-center'>
            <img src={user?.imageUrl} alt="user-avatar" width={200} height={200} className='rounded-full h-30 w-30' />
          </div>
          <div className='flex flex-col col-span-3 gap-2'>
            <h1 className='text-4xl font-bold'>{Name ? Name : (user ? user.fullName : 'Name')}</h1>
            <p className='font-light text-xl pl-[1px]'>{description}</p>
            <div className='font-light text-md flex gap-3 -ml-1'>
              <p className='flex'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="20px" height="25px"><path fill="#282828" d="M100.232 149.198c-2.8 0-5.4-1.8-7.2-5.2-22.2-41-22.4-41.4-22.4-41.6-3.2-5.1-4.9-11.3-4.9-17.6 0-19.1 15.5-34.6 34.6-34.6s34.6 15.5 34.6 34.6c0 6.5-1.8 12.8-5.2 18.2 0 0-1.2 2.4-22.2 41-1.9 3.4-4.4 5.2-7.3 5.2zm.1-95c-16.9 0-30.6 13.7-30.6 30.6 0 5.6 1.5 11.1 4.5 15.9.6 1.3 16.4 30.4 22.4 41.5 2.1 3.9 5.2 3.9 7.4 0 7.5-13.8 21.7-40.1 22.2-41 3.1-5 4.7-10.6 4.7-16.3-.1-17-13.8-30.7-30.6-30.7z" /><path fill="#282828" d="M100.332 105.598c-10.6 0-19.1-8.6-19.1-19.1s8.5-19.2 19.1-19.2c10.6 0 19.1 8.6 19.1 19.1s-8.6 19.2-19.1 19.2zm0-34.3c-8.3 0-15.1 6.8-15.1 15.1s6.8 15.1 15.1 15.1 15.1-6.8 15.1-15.1-6.8-15.1-15.1-15.1z" /></svg>{location ? location : 'Location'}</p>
              <div className='flex gap-1'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400 mt-1'/>
              <p>4.8 rating</p>
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            <button onClick={updateProfile} className='bg-red-500 text-white py-2 px-5 rounded-lg'>Edit</button>
          </div>
        </div>
        <h1 className='mt-10 text-xl md:text-3xl font-semibold'>Event Attendance</h1>
          <div className='grid lg:grid-cols-2 xl:grid-cols-4 gap-4 w-full col-span-4 mt-5'>
            {/* <div className='w-full h-40 hover:-translate-y-[.3rem] transition ease-in-out duration-300 hover:shadow-lg border-2 border-black/5 rounded-xl flex flex-col items-center justify-center'>
            <h3 className='text-lg'>Event Attend</h3>
            <p className='text-sm font-normal text-gray-500'>Event Name</p>
            </div>
            <div className='w-full h-40 hover:-translate-y-[.3rem] transition ease-in-out duration-300 hover:shadow-lg border-2 border-black/5 rounded-xl flex flex-col items-center justify-center'>
            <h3 className='text-lg'>Event Attend</h3>
            <p className='text-sm font-normal text-gray-500'>Event Name</p>
            </div>
            <div className='w-full h-40 hover:-translate-y-[.3rem] transition ease-in-out duration-300 hover:shadow-lg border-2 border-black/5 rounded-xl flex flex-col items-center justify-center'>
            <h3 className='text-lg'>Event Attend</h3>
            <p className='text-sm font-normal text-gray-500'>Event Name</p>
            </div>
            <div className='w-full h-40 hover:-translate-y-[.3rem] transition ease-in-out duration-300 hover:shadow-lg border-2 border-black/5 rounded-xl flex flex-col items-center justify-center'>
            <h3 className='text-lg'>Event Attend</h3>
            <p className='text-sm font-normal text-gray-500'>Event Name</p>
            </div> */}
          {events.map((event) => (
            <div
                  key={event.id}
                  className="w-full h-40 hover:-translate-y-[.3rem] transition ease-in-out duration-300 hover:shadow-lg border-2 border-black/5 rounded-xl flex flex-col items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-subtle rounded-lg flex items-center justify-center mx-auto mb-3 p-1 bg-red-500/7">
                      <Star className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="font-medium mb-1">Event Attend</h3>
                    <p className="text-sm text-muted-foreground">{event.title}</p>
                  </div>
                </div>
              ))}
          </div>
        <hr className='mt-10 bg-gray-300'/>
        <div className='md:mt-10 flex flex-col items-center gap-10 xl:gap-0 lg:flex-row justify-around py-10'>
           <div className='flex flex-col gap-2 text-center w-1/4'>
            <p className='text-2xl font-extrabold text-red-500'>24</p>
            <p>Events Attended</p>
           </div>
           <div className='flex flex-col gap-2 text-center w-1/4'>
            <p className='text-2xl font-extrabold text-red-500'>156</p>
            <p>Connections</p>
           </div>
           <div className='flex flex-col gap-2 text-center w-1/4'>
            <p className='text-2xl font-extrabold text-red-500'>4.8</p>
            <p>Average Rating</p>
           </div>
        </div>
        </div>
      </div>
      {
        editProfile && (
            <EditProfile seteditProfile={seteditProfile} description={description} location={location}/>
        )
      }
    </div>
  )
}

export default Page
