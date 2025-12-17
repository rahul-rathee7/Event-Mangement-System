'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/UserContext'
import { useEventContext } from '@/context/EventContext'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Star, Share2, Heart, Ticket, ArrowRight, ChevronDown, Bookmark, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'
// Fallback Tooltip (removed import from '@/components/ui/tooltip' which wasn't found)
const Tooltip = ({ children, content }: { children: React.ReactNode; content?: string }) => (
  <span title={content} className="relative inline-block">
    {children}
  </span>
)
// Local fallback useMediaQuery hook (replaces missing '@/hooks/useMediaQuery')
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Prefer modern addEventListener/removeEventListener, fallback to addListener/removeListener
    if (mql.addEventListener) {
      mql.addEventListener('change', handler)
    } else {
      mql.addListener(handler)
    }

    // set initial value
    setMatches(mql.matches)

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler)
      } else {
        mql.removeListener(handler)
      }
    }
  }, [query])

  return matches
}

// Loading skeleton with shimmer effect
const EventSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4">
    <div className="relative h-[400px] w-full bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-8 overflow-hidden">
      <div className="shimmer-effect"></div>
    </div>
    <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 w-3/4 rounded-lg mb-4 overflow-hidden">
      <div className="shimmer-effect"></div>
    </div>
    <div className="flex gap-4 mb-8">
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-32 rounded-md overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-40 rounded-md overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 w-40 rounded-lg mb-4 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-full rounded mb-2 overflow-hidden">
            <div className="shimmer-effect"></div>
          </div>
        ))}
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-3/4 rounded mb-8 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
        
        <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 w-32 rounded-lg mb-4 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
        <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
      </div>
      <div>
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl mb-8 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
        <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 w-40 rounded-lg mb-4 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl mb-4 overflow-hidden">
          <div className="shimmer-effect"></div>
        </div>
      </div>
    </div>
  </div>
);

// Optimized related event card component
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
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3">
          <p className="text-white font-medium line-clamp-1">{event.title}</p>
          <p className="text-white/80 text-xs">{event.date}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Share menu component
const ShareMenu = ({ isOpen, onClose }) => {
  const shareOptions = [
    { name: 'Facebook', icon: 'facebook.svg', color: 'bg-blue-600' },
    { name: 'Twitter', icon: 'twitter.svg', color: 'bg-blue-400' },
    { name: 'WhatsApp', icon: 'whatsapp.svg', color: 'bg-green-500' },
    { name: 'Email', icon: 'email.svg', color: 'bg-gray-600 dark:bg-gray-700' },
  ];
  
  const shareRef = useRef(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={shareRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-10"
        >
          <div className="flex flex-col gap-2">
            {shareOptions.map((option) => (
              <button 
                key={option.name}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 whitespace-nowrap"
              >
                <div className={`w-7 h-7 rounded-full ${option.color} flex items-center justify-center text-white`}>
                  {option.name.charAt(0)}
                </div>
                {option.name}
              </button>
            ))}
            
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  onClose();
                }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 w-full"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
                Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Location map component (lazy loaded)
const EventMap = ({ location }) => (
  <div className="relative h-60 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <MapPin className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      <span className="ml-2 text-gray-500 dark:text-gray-400">{location || 'Location map'}</span>
    </div>
  </div>
);

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { events } = useEventContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showTicketOptions, setShowTicketOptions] = useState(false);
  const shareButtonRef = useRef(null);
  
  // Check for mobile screens
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Scroll animations
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [0, 1]);
  
  // Simulate loading state for smoother transitions
  useEffect(() => {
    // Prefetch related pages for faster navigation
    if (events.length > 0) {
      router.prefetch('/events');
    }
    
    // Progressive loading strategy
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [events, router]);
  
  const eventDetails = events.find(event => event.id === parseInt(id));
  
  // Find related events (same category or similar) with memoization
  const relatedEvents = React.useMemo(() => {
    if (!eventDetails) return [];
    
    return events
      .filter(event => 
        event.id !== parseInt(id) && 
        (event.category === eventDetails?.category || 
         event.tags?.some(tag => eventDetails?.tags?.includes(tag)))
      )
      .slice(0, 3);
  }, [events, id, eventDetails]);
  
  const handleRegisterClick = () => {
    if (!user) {
      router.push(`/userAuth/login?redirect=/events/${id}/register`);
    } else {
      router.push(`/events/${id}/register`);
    }
  }
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    // Provide visual feedback with animation
    const button = e.currentTarget;
    button.classList.add('animate-pulse');
    setTimeout(() => button.classList.remove('animate-pulse'), 500);
    
    setIsFavorite(!isFavorite);
    // Add logic to save to user favorites
  }
  
  if (!eventDetails && !isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full inline-flex items-center justify-center mb-6">
            <Info className="h-12 w-12 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            The event you're looking for doesn't exist or has been removed. It might have been cancelled or moved.
          </p>
          <button 
            onClick={() => router.push('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2 mx-auto"
          >
            Browse Events <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed header that appears when scrolling */}
      <motion.div 
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-20 transform-gpu"
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-[50%]">
            {eventDetails?.title}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`p-2 rounded-full ${
                isFavorite 
                  ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={handleRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-1"
            >
              Register
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      {isLoading ? <EventSkeleton /> : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image Section with Parallax Effect */}
          <div className="relative w-full h-[350px] md:h-[500px]">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image 
                src={eventDetails?.image} 
                alt={eventDetails?.title}
                fill
                priority
                sizes="100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {eventDetails?.category || 'Event'}
                    </span>
                    {eventDetails?.featured && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-sm">
                    {eventDetails?.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/90">
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
          <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
            {/* Quick action panel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mr-4">
                    <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Price</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {eventDetails?.price === 0 ? 'Free Entry' : `$${eventDetails?.price || '25'}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400' 
                        : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                    <span>{isFavorite ? 'Saved' : 'Save'}</span>
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button
                      ref={shareButtonRef}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsShareOpen(!isShareOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      aria-label="Share this event"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </motion.button>
                    
                    <ShareMenu 
                      isOpen={isShareOpen}
                      onClose={() => setIsShareOpen(false)}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegisterClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    Register Now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2">
                {/* Description Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
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
                          {eventDetails?.description || 'No description available for this event.'}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    
                    {eventDetails?.description && eventDetails.description.length > 200 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-3 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
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
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tickets</h2>
                  
                  <div className={`space-y-4 transition-all duration-300 ${showTicketOptions ? 'max-h-[800px]' : 'max-h-[400px]'}`}>
                    {/* Standard Ticket */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Standard Admission
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900/30 dark:text-green-400">Available</span>
                          </h3>
                          <div className="flex items-center mt-1">
                            <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {eventDetails?.price === 0 ? 'Free Entry' : `$${eventDetails?.price || '25'}`}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            General admission with access to all standard areas and activities.
                          </p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleRegisterClick}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
                        >
                          Select <CheckCircle className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* VIP Ticket (only if event is paid) */}
                    {eventDetails?.price > 0 && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              VIP Experience
                              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-400">Limited</span>
                            </h3>
                            <div className="flex items-center mt-1">
                              <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                ${(eventDetails?.price * 2.5).toFixed(2) || '65'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              Premium experience with priority access, exclusive areas, and special perks.
                            </p>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleRegisterClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
                          >
                            Select <CheckCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                    
                    {/* Group Ticket (only show if expanded) */}
                    {showTicketOptions && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              Group Package (5+ people)
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">20% Off</span>
                            </h3>
                            <div className="flex items-center mt-1">
                              <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                ${eventDetails?.price * 0.8 || '20'} per person
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              Special rate for groups of 5 or more people attending together.
                            </p>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleRegisterClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
                          >
                            Select <CheckCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Show more/less tickets button */}
                  <button 
                    onClick={() => setShowTicketOptions(!showTicketOptions)}
                    className="mt-4 w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {showTicketOptions ? 'Show fewer options' : 'Show more ticket options'}
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showTicketOptions ? 'rotate-180' : ''}`} />
                  </button>
                </motion.div>
                
                {/* Event Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
                  
                  <Suspense fallback={<div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
                  </div>}>
                    <EventMap location={eventDetails?.location} />
                  </Suspense>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{eventDetails?.venue || 'Event Venue'}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{eventDetails?.location}</p>
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
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 sticky top-20"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organizer</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                      <Image 
                        src={eventDetails?.organizerImage || '/assets/default-avatar.png'} 
                        alt="Organizer" 
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{eventDetails?.organizer || 'Event Organizer'}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-amber-500 mr-1 fill-amber-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">4.8 (42 events)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{eventDetails?.attendees || 42} people attending</span>
                    </p>
                    
                    <div className="flex -space-x-2 overflow-hidden mt-2">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700">
                        </div>
                      ))}
                      <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 text-xs font-medium text-blue-600 dark:text-blue-400">+15</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors text-sm">
                      Contact Organizer
                    </button>
                  </div>
                </motion.div>
                
                {/* Related Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Events</h3>
                  <div className="space-y-4">
                    {relatedEvents.length > 0 ? (
                      relatedEvents.map((event, index) => (
                        <RelatedEventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          No related events found
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Link href="/events" className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center">
                      View All Events
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Add global styles for shimmer effect */}
      <style jsx global>{`
        .shimmer-effect {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .dark .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>
    </div>
  )
}

export default React.memo(EventDetailsPage)