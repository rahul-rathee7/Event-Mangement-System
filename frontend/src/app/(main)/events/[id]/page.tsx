'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/UserContext'
import { useEventContext } from '@/context/EventContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Mail, Share2, Heart, Ticket, ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

// Loading skeleton
const EventSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4 animate-pulse">
    <div className="h-[400px] w-full bg-gray-300 dark:bg-gray-700 rounded-2xl mb-8"></div>
    <div className="h-10 bg-gray-300 dark:bg-gray-700 w-3/4 rounded-lg mb-4"></div>
    <div className="flex gap-4 mb-8">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 w-32 rounded-md"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-800 w-40 rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 w-40 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4 rounded mb-8"></div>
        
        <div className="h-8 bg-gray-300 dark:bg-gray-700 w-32 rounded-lg mb-4"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
      <div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 w-40 rounded-lg mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const RelatedEventCard = ({ event }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group cursor-pointer"
  >
    <Link href={`/events/${event.id}`} className="block">
      <div className="relative w-full h-32 md:h-36 rounded-xl overflow-hidden mb-2">
        <Image 
          src={event.image} 
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3">
          <p className="text-white font-medium line-clamp-1">{event.title}</p>
          <p className="text-white/80 text-xs">{event.date}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { events } = useEventContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ organizerInfo, setOrganizerInfo ] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const eventDetails = events.find(event => event._id === id);
  
  const relatedEvents = events
    .filter(event => 
      event._id !== id && 
      (event.category === eventDetails?.category || 
       event.tags?.some(tag => eventDetails?.tags?.includes(tag)))
    )
    .slice(0, 3);
  
  const handleRegisterClick = () => {
    if (!user) {
      alert("Please login first");
      router.push(`/userAuth/login`);
    }
    else if(user._id === organizerInfo?._id) {
      alert("You are the organizer of this event");
      router.push(`/events`);
    } else {
      router.push(`/events/${id}/register`);
    }
  }
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  }

  useEffect(() => {
    setTimeout(() => {
      
    }, 200);
    async function fetchOrganizerInfo() {
    if (user && eventDetails) {
      const res = await axios.post(`http://localhost:5000/api/users/getUserByName`, {
        id: eventDetails.organizerInfo
      }, { withCredentials: true });
      if(res.data.success){
        setOrganizerInfo(res.data.user);
        return;
      }
    }
  }
  fetchOrganizerInfo();
  }, [user, eventDetails]);
  
  if (!eventDetails && !isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16">
      {isLoading ? <EventSkeleton /> : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image Section */}
          <div className="relative w-full h-[350px] md:h-[450px]">
            <Image 
              src={eventDetails?.image} 
              alt={eventDetails?.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {eventDetails?.category || 'Event'}
                    </span>
                    {eventDetails?.featured && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{eventDetails?.title}</h1>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
                    {eventDetails?.date && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{eventDetails.date}</span>
                      </div>
                    )}
                    
                    {eventDetails?.time && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{eventDetails.time}</span>
                      </div>
                    )}
                    
                    {eventDetails?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{eventDetails.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-4 mt-8 md:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-3 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400' 
                        : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isFavorite ? 'Saved' : 'Save'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </motion.button>
                </div>
                
                {/* Description Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-10"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Details</h2>
                  <div className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showFullDescription ? 'full' : 'truncated'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className={showFullDescription ? '' : 'line-clamp-3'}>
                          {eventDetails?.description || 'No description available.'}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    
                    {eventDetails?.description && eventDetails.description.length > 200 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {showFullDescription ? 'Show less' : 'Read more'}
                        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </motion.div>
                
                {/* Tickets Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tickets</h2>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Standard Admission</h3>
                        <div className="flex items-center mt-1">
                          <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {eventDetails?.price === 0 ? 'Free Entry' : `$${eventDetails?.price || '25'}`}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Limited spots available. Register now to secure your place.
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRegisterClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 shadow-sm"
                      >
                        Register Now <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Column - Sidebar */}
              <div>
                {/* Organizer Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organizer</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                      <Image 
                        src={organizerInfo?.image || '/assets/user.png'} 
                        alt="Organizer" 
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{organizerInfo?.fullname || 'Event Organizer'}</p>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{organizerInfo?.email}</span> 
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center mb-1">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{eventDetails?.attendees || 42} people attending</span>
                    </p>
                  </div>
                </motion.div>
                
                {/* Related Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Events</h3>
                  <div className="space-y-4">
                    {relatedEvents.length > 0 ? (
                      relatedEvents.map((event, index) => (
                        <RelatedEventCard key={event._id} event={event} />
                      ))
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          No related events found
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default EventDetailsPage