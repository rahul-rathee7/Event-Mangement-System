'use client'

import React, {useState, useRef, useEffect} from 'react'
import { useAuth } from '@/context/UserContext'
import EditSvg from '@/../public/assets/edit.png'
import Image from 'next/image'
import axios from 'axios'

const EditProfile = ({seteditProfile}) => {
    const { user, setProfileImage } = useAuth();
    const [Name, setName] = useState(user?.fullname ? user.fullname : '');
    const [newdescription, setNewdescription] = useState(user?.description ? user.description : '');
    const [newlocation, setNewlocation] = useState(user?.location ? user.location : '');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const updateProfile = (e) => {
        e.preventDefault();
        seteditProfile(false);
    }

    const closeModal = (e) => {
        e.stopPropagation();   
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          await axios.post(`${process.env.BACKEND_API_KEY}/users/update_data`, { email: user?.email, fullName: Name, description: newdescription, location: newlocation }).then((res) => {
            if(res.data.success) {
              seteditProfile(false);
              alert(res.data.message);
            }
            else{
              alert(res.data.message);
            }
          })
        }catch(err) {
          console.log(err);
        }
    }

    const handleFileClick = () => {
      fileInputRef.current?.click();
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      setProfileImage(file);
    }

  return (
    <div className='fixed top-0 h-screen w-screen bg-black/80 sm:p-10 md:bg-black/50 z-99' onMouseDown={updateProfile}>
      <div className='bg-white w-full md:w-180 flex flex-col m-auto translate-y-1/6 text-black rounded-4xl md:py-10 py-4' onMouseDown={closeModal}>
        <h1 className='text-4xl text-center md:pt-5'>Update Profile</h1>
        <form className='flex flex-col md:w-110 m-auto md:mt-2 p-3 md:p-5 rounded-[50px]'>
            {
                user?.image &&
                  <div className='border-2 relative w-fit rounded-full border-red-500 p-[0.2rem] self-center mb-5'>
                      <img src={user.image} alt="user-avatar" width={120} height={120} className='rounded-full h-25 md:h-35 w-25 md:w-35' />
                      <Image onClick={handleFileClick} src={EditSvg} alt="svg-icon" width={35} height={35} className="p-1 bg-white absolute bottom-2 rounded-lg right-2" />
                      <input ref={fileInputRef} className='hidden' type="file" accept='image/*' onChange={handleFileChange}/>
                  </div>  
            }
            <input 
            type="text" 
            placeholder='Enter Your Name'
            onChange={(e) => setName(e.target.value)}
            value={Name}
            className='text-gray-600 border-2 border-black rounded-4xl py-[.1rem] md:py-[.5rem] w-full outline-none px-5 text-2xl focus:outline-none'
            />
            <input 
            type="text" 
            placeholder='Enter description'
            onChange={(e) => setNewdescription(e.target.value)}
            value={newdescription}
            className='text-gray-600 border-2 border-black rounded-4xl mt-5 py-[.1rem] md:py-[.5rem] w-full outline-none px-5 text-2xl focus:outline-none'
            />
            <input 
            type="text" 
            placeholder='Enter location'
            onChange={(e) => setNewlocation(e.target.value)}
            value={newlocation}
            className='text-gray-600 border-2 border-black rounded-4xl mt-5 py-[.1rem] md:py-[.5rem] w-full outline-none px-5 text-2xl focus:outline-none'
            />
            <button type='submit' 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white md:py-3 py-2 rounded-4xl mt-5 hover:bg-indigo-700 transition disabled:opacity-50">Update</button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
