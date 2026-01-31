'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleButton from '../ui/theme-toggle-button';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, Search, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event?: Event) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

type NavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  const router = useRouter();
  
  return (
    <motion.li 
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button 
        onClick={() => router.push(href)}
        className='px-4 py-2 rounded-lg font-medium text-lg transition-colors'
      >
        {label}
        {isActive && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-0 right-0 mx-auto w-1/2 h-1 bg-[#003199] dark:bg-background rounded-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </motion.li>
  );
};

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  user: { fullname?: string; email?: string; image?: string; role?: string } | null;
  SignOutButton: () => void;
};

const MobileNav = ({ isOpen, onClose, user, SignOutButton }: MobileNavProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const mobileNavRef = useRef(null);

  useOnClickOutside(mobileNavRef, () => {
    if (isOpen) onClose();
  });

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        >
          <motion.div
            ref={mobileNavRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-screen w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-xl"
          >
            <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-[#003199] dark:text-white">Menu</h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {user?.fullname && (
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#003199] dark:border-white/50">
                    <Image 
                      src={user?.image || '/assets/default-avatar.png'} 
                      alt={user?.fullname || 'User'} 
                      fill 
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user?.fullname}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button 
                    onClick={() => handleNavigation(`${user?.role === 'admin' ? '/admin/profile' : '/profile'}`)}
                    className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                  <button 
                    onClick={() => handleNavigation('/settings')}
                    className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200 text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </div>
              </div>
            )}
            
            <nav className="p-5">
              <ul className="space-y-3">
                {['Home', 'about', 'contact', 'events'].map((item) => {
                  const path = item === 'Home' ? '/' : `/${item}`;
                  const adjustedPath = user?.role === 'admin' && item === 'events' ? '/admin/events' : path;

                  return (
                    <li key={item}>
                      <button 
                        onClick={() => handleNavigation(adjustedPath)}
                        className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                          pathname === path
                            ? 'bg-[#003199]/10 text-[#003199] dark:bg-[#003199]/20 dark:text-white font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
              
              {!user?.fullname ? (
                <div className="mt-5">
                  <button 
                    onClick={() => handleNavigation('/userAuth/login')}
                    className="w-full py-3 rounded-lg bg-[#003199] text-white font-medium transition-colors hover:bg-[#002580] flex items-center justify-center"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => handleNavigation('/userAuth/signup')}
                    className="w-full mt-2 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    SignOutButton();
                    onClose();
                  }}
                  className="w-full mt-5 py-3 rounded-lg text-red-600 dark:text-red-500 font-medium border border-red-200 dark:border-red-900/30 transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserDropdown = ({ isOpen, user }) => {
  const { SignOutButton } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  useOnClickOutside(dropdownRef, () => {
    if (isOpen) {
      // Close dropdown
    }
  });
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image 
                  src={user?.image || '/assets/default-avatar.png'} 
                  alt={user?.fullname || 'User'} 
                  fill 
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.fullname}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button 
              onClick={() => router.push(`${user?.role === 'admin' ? '/admin/profile' : '/profile'}`)}
              className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">My Profile</span>
            </button>
            
            <button 
              onClick={() => router.push('/settings')}
              className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">Settings</span>
            </button>
            
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            
            <button 
              onClick={SignOutButton}
              className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const { user, SignOutButton } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textColor = isScrolled
  ? 'text-gray-900 dark:text-white'
  : 'text-[#003199] dark:text-white';
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Track if we should close dropdown when clicked outside
  useOnClickOutside(dropdownRef, () => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  });
  
  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  const navLinks = useMemo(() => [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: user?.role === 'admin' ? '/admin/events' : '/events', label: 'Events' },
  ], [user?.role]);
  
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md text-gray-900 dark:text-white' 
            : 'py-3 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link href="/">
                <h1 className={`text-2xl sm:text-3xl font-bold dark:text-background`}>
                  Eventify
                </h1>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    isActive={pathname === link.href || 
                             (link.href !== '/' && pathname?.startsWith(link.href)) ||
                             (link.href === '/' && pathname === '/')}
                  />
                ))}
              </ul>
            </nav>
            
            {/* Search Box - Desktop */}
            <div className="hidden md:block flex-1 max-w-xs mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003199] dark:focus:ring-[#5f80d2] transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              </form>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Theme Toggle */}
              <ThemeToggleButton />
              
              {/* Login/User Profile */}
              {user?.fullname ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Open user menu"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#003199] dark:border-white/50">
                      <Image 
                        src={user?.image || '/assets/default-avatar.png'} 
                        alt={user?.fullname || 'User'} 
                        fill 
                        className="object-cover"
                        sizes="32px"
                        priority
                      />
                    </div>
                    <span className="hidden md:block font-medium text-gray-800 dark:text-gray-200">
                      {user?.fullname?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  
                  <UserDropdown isOpen={isDropdownOpen} user={user} />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/userAuth/login')}
                  className="hidden sm:flex items-center gap-1 py-2 px-4 rounded-lg bg-[#003199] hover:bg-[#002580] text-white font-medium transition-colors"
                >
                  Log In
                </motion.button>
              )}
              
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        user={user}
        SignOutButton={SignOutButton}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default React.memo(Navbar);