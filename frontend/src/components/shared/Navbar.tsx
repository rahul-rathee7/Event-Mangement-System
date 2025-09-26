'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FlipLink from "@/components/ui/text-effect-flipper";
import ThemeToggleButton from '../ui/theme-toggle-button';
import { Menu } from 'lucide-react';
import NavDropDown from '../NavDropDown';

const Navbar = () => {
    const { user } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className='flex mt-3 sticky top-0 bg-transparent backdrop-blur-lg z-50 items-center justify-between items-center md:h-20 md:border-2 dark:border-white/40 border-black/40 md:rounded-full w-full mx-auto md:w-11/12 md:px-10 px-3'>
            <h1 className='text-3xl font-bold text-[#003161] dark:text-white'>Eventify</h1>
            <nav className='hidden lg:flex h-full'>
                <ul className='flex h-full gap-2'>
                    <li className='px-5 h-full flex items-center rounded-lg'><FlipLink className="font-light" onClick={() => router.push('/')}>Home</FlipLink></li>
                    <li className='px-5 h-full flex items-center rounded-lg'><FlipLink className="font-light" onClick={() => router.push('/userAuth/login')}>About</FlipLink></li>
                    <li className='px-5 h-full flex items-center rounded-lg'><FlipLink className="font-light" onClick={() => router.push('/userAuth/register')}>Contact</FlipLink></li>
                    <li className='px-5 h-full flex items-center rounded-lg'><FlipLink className="font-light" onClick={() => router.push('/events')}>Events</FlipLink></li>
                </ul>
            </nav>
            <div className='flex gap-6 items-center'>
                {user?.fullName == null ?
                    <button onClick={() => router.push('/userAuth/login')} className='hidden md:flex px-5 py-2 rounded-lg bg-red-500 text-white justify-center items-center gap-2'>
                        Login
                    </button>
                    :
                    <div className='relative hidden md:block' ref={dropdownRef}>
                        <div className='flex items-center gap-3'>
                            <div className='flex gap-1'>
                                <FlipLink>{user?.firstName}</FlipLink>
                            </div>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-label="Open user menu">
                                <img src={user?.imageUrl} alt={user?.fullName || 'User profile picture'} className='w-10 h-10 rounded-full' />
                            </button>
                        </div>
                        <NavDropDown className={`${isDropdownOpen ? 'block' : 'hidden'}`} />
                    </div>
                }
                <ThemeToggleButton />
                <div className='md:hidden self-end'>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-label="Open user menu">
                        <Menu className='w-7 h-7' />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar;