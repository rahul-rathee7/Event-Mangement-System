'use client';

import React, { useState, useEffect, Suspense } from 'react'
import { Music, Shrub, Trophy, Monitor, Search, Book, PartyPopper, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useEventContext } from '@/context/EventContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

// Dynamically import components below the fold
const Skiper47 = dynamic(
  () => import('../ui/skiper-ui/skiper47').then(mod => ({ default: mod.Skiper47 })),
  { ssr: false, loading: () => <SkeletonCarousel /> }
);

// Skeletons for lazy-loaded content
const SkeletonCard = () => (
  <div className="border-2 rounded-xl p-5 animate-pulse">
    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-3"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-4"></div>
    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
  </div>
);

const SkeletonCarousel = () => (
  <div className="w-full py-10 flex space-x-4 overflow-hidden">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-1/3 animate-pulse">
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
      </div>
    ))}
  </div>
);

const CategoryCard = ({ icon, title, color }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl flex flex-col gap-3 items-center justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className={`rounded-full p-5 ${color}`}>
        {icon}
      </div>
      <p className="text-xl font-semibold dark:text-white">{title}</p>
    </motion.div>
  );
};

const EventCard = ({ event, index }) => {
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="border-0 rounded-xl p-0 mb-5 overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="relative w-full h-48 overflow-hidden">
          <Image 
            src={event.image || '/assets/event-placeholder.jpg'} 
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h4 className="text-xl font-bold text-white">{event.title}</h4>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center mb-3 text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full font-semibold bg-[#003161] hover:bg-[#003161]/90 dark:bg-[#1e3a60] dark:hover:bg-[#1e3a60]/90 text-white py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-all"
            onClick={() => router.push(`/events/${event.id}`)}
          >
            View Details <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorksStep = ({ icon, title, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex flex-col items-center justify-center gap-5 relative"
    >
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="rounded-full bg-[#003161]/10 dark:bg-[#003161]/20 p-6"
      >
        {icon}
      </motion.div>
      <p className="text-2xl font-medium dark:text-white">{title}</p>
      {index < 2 && (
        <div className="hidden md:block absolute top-1/3 right-[-30%] transform -translate-y-1/2 w-1/2 h-[2px] bg-gray-300 dark:bg-gray-700">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#003161] dark:bg-white"></div>
        </div>
      )}
    </motion.div>
  );
};

const HeroSection = () => {
  const router = useRouter();
  const { FeaturedEvents, events } = useEventContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Header with optimized image */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 z-10"></div>
        <Image
          src="/assets/event_HomePage.jpeg"
          alt="Events background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
        />
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl"
          >
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.2] drop-shadow-lg mb-6">
              Plan, Manage & Join <br className="hidden md:block" /> Events Effortlessly
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
              Discover and book events near you in just one click
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/events')}
              className="font-semibold bg-[#003161] hover:bg-[#003190] text-white py-4 px-10 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              Explore Events <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="my-20"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">Event Categories</h2>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-[#003161] dark:text-[#4f85cc] font-medium flex items-center"
            >
              View all <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <CategoryCard 
              icon={<Music size={60} className="text-blue-500" strokeWidth={1.5} />}
              title="Music" 
              color="bg-blue-50 dark:bg-blue-900/20"
            />
            <CategoryCard 
              icon={<Shrub size={60} className="text-green-500" strokeWidth={1.5} />}
              title="Cultural" 
              color="bg-green-50 dark:bg-green-900/20"
            />
            <CategoryCard 
              icon={<Trophy size={60} className="text-amber-500" strokeWidth={1.5} />}
              title="Sports" 
              color="bg-amber-50 dark:bg-amber-900/20"
            />
            <CategoryCard 
              icon={<Monitor size={60} className="text-purple-500" strokeWidth={1.5} />}
              title="Tech" 
              color="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>
        </motion.div>

        {/* Featured Events Section */}
        <div className="my-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">Featured Events</h2>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => router.push('/events')}
              className="text-[#003161] dark:text-[#4f85cc] font-medium flex items-center"
            >
              All events <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FeaturedEvents.length !== 0 ? (
              FeaturedEvents.slice(0, 3).map((event, index) => (
                <EventCard key={event.id || index} event={event} index={index} />
              ))
            ) : (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="my-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-10 relative">
            <HowItWorksStep 
              icon={<Search size={50} className="text-[#003161] dark:text-[#4f85cc]" strokeWidth={1.5} />} 
              title="Browse Events" 
              index={0}
            />
            <HowItWorksStep 
              icon={<Book size={50} className="text-[#003161] dark:text-[#4f85cc]" strokeWidth={1.5} />} 
              title="Register/Book" 
              index={1}
            />
            <HowItWorksStep 
              icon={<PartyPopper size={50} className="text-[#003161] dark:text-[#4f85cc]" strokeWidth={1.5} />} 
              title="Attend & Enjoy" 
              index={2}
            />
          </div>
        </div>

        {/* Carousel Section - Dynamically loaded */}
        <div className="my-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 dark:text-white">Upcoming Events</h2>
          <Suspense fallback={<SkeletonCarousel />}>
            <Skiper47 events={events} />
          </Suspense>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="my-20 py-16 px-6 md:px-12 bg-gradient-to-r from-[#002850] to-[#003161] rounded-2xl text-center text-white shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Latest Events</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Subscribe to our newsletter and never miss an exciting event happening near you.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow py-3 px-4 placeholder:text-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#003161] border-1"
              aria-label="Email address for newsletter subscription"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#003161] font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection;