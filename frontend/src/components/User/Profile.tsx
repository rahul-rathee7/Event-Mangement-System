'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/UserContext'
import EditProfile from '@/components/EditProfile'
import { Star, Calendar, Users, MapPin, Award, ChevronRight, Edit, Moon, Sun } from 'lucide-react'
import { useEventContext } from '@/context/EventContext'
import userPng from '@/../public/assets/user.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type StatCardProps = {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => (
  <motion.div 
    className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 dark:shadow-gray-900"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400">
      {icon}
    </div>
    <p className="text-3xl font-bold text-red-500 dark:text-red-400">{value}</p>
    <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
  </motion.div>
);

const EventCard: React.FC<{ event: any }> = ({ event }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
  >
    <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-red-100 dark:bg-gray-700">
      {event.image ? (
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Calendar className="h-10 w-10 text-red-300 dark:text-red-400" />
        </div>
      )}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{event.title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-grow">
      {event.description || 'No description available'}
    </p>
    <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
      <Calendar className="w-3 h-3 mr-1" />
      <span>{event.date || 'Upcoming'}</span>
      <div className="ml-auto flex items-center">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
        <span>4.8</span>
      </div>
    </div>
  </motion.div>
);

const Profile: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { events } = useEventContext();
  const [editProfile, setEditProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Memoize event list to prevent unnecessary re-renders
  const recentEvents = useMemo(() => events.slice(0, 4), [events]);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const updateProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditProfile(!editProfile);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
              <Moon className="h-6 w-6 text-gray-700" />
            )}
          </motion.button>
        </div>
        
        {/* Profile Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900 overflow-hidden transition-colors duration-300"
        >
          <div className="h-32 bg-[image:var(--gradient-hero)]"></div>
          
          <div className="p-6 md:p-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative border-4 w-32 h-32 rounded-full border-white dark:border-gray-800 shadow-md self-center md:self-start"
              >
                <Image 
                  src={user?.image || userPng} 
                  alt="user-avatar" 
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, 128px"
                  priority
                />
              </motion.div>
              
              {/* User Details */}
              <div className="flex flex-col md:mt-16 flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                    {user?.fullname || 'User Name'}
                  </h1>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={updateProfile}
                    className="mt-4 md:mt-0 bg-[image:var(--gradient-hero)] text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                </div>
                
                <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {user?.description || 'Add a short bio to tell people more about yourself...'}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <MapPin className="w-5 h-5 mr-1 text-red-500 dark:text-red-400" />
                    <span>{user?.location || 'Add your location'}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <Star className="w-5 h-5 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>4.8 rating</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <Calendar className="w-5 h-5 mr-1 text-blue-500 dark:text-blue-400" />
                    <span>Joined {user?.joinDate || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Events Section */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Recent Event Attendance</h2>
            <motion.button 
              onClick={() => router.push('/events')}
              whileHover={{ x: 5 }}
              className="text-red-500 dark:text-red-400 flex items-center font-medium transition-colors duration-300"
            >
              See all <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                No events attended yet. Start exploring events!
              </p>
            )}
          </div>
        </motion.section>
        
        {/* Stats Section */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 mb-6">Your Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              value="24" 
              label="Events Attended" 
              icon={<Calendar className="w-6 h-6" />} 
            />
            
            <StatCard 
              value="156" 
              label="Connections" 
              icon={<Users className="w-6 h-6" />} 
            />
            
            <StatCard 
              value="4.8" 
              label="Average Rating" 
              icon={<Award className="w-6 h-6" />} 
            />
          </div>
        </motion.section>
      </div>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="dark:bg-gray-800 rounded-2xl max-w-md w-full mx-4"
            >
              <EditProfile 
                seteditProfile={setEditProfile} 
                description={user?.description} 
                location={user?.location}
                darkMode={darkMode}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default React.memo(Profile)