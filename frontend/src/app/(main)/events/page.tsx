'use client'

import React, { useState, useMemo } from 'react'
import { useEventContext } from '@/context/EventContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Filter, ChevronDown, X } from 'lucide-react';

// Event Card Component
const EventCard = ({ event, index }) => {
  const router = useRouter();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => router.push(`/events/${event.id}`)}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300"
    >
      <div className="relative w-full h-48">
        <Image 
          src={event.image} 
          alt={event.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={index < 4}
          loading={index >= 4 ? "lazy" : "eager"}
        />
        {event.featured && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-md">
            Featured
          </span>
        )}
        {event.price && (
          <span className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
        )}
        
        <div className="flex flex-col gap-1.5">
          {event.date && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
              <Calendar size={14} className="mr-1.5" />
              <span>{event.date}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
              <MapPin size={14} className="mr-1.5" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton loader for events while loading
const EventSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2 mb-3 animate-pulse"></div>
      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/3 mb-1 animate-pulse"></div>
      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/4 animate-pulse"></div>
    </div>
  </div>
);

// Main Component
const EventsPage = () => {
  const router = useRouter();
  const { events, isLoading } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Categories - normally you'd get these from your API
  const categories = useMemo(() => {
    const allCategories = ['All'];
    events.forEach(event => {
      if (event.category && !allCategories.includes(event.category)) {
        allCategories.push(event.category);
      }
    });
    return allCategories;
  }, [events]);
  
  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Search */}
      <div className="relative bg-[image:var(--gradient-hero)]">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Discover Amazing Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto mb-8"
            >
              Find and join events that match your interests, connect with people, and create unforgettable memories.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for events..."
                  className="w-full pl-12 pr-12 py-4 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Advanced Filters (conditionally shown) */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply Filters</button>
            </div>
          </motion.div>
        )}
        
        {/* Events Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {searchTerm ? ` matching "${searchTerm}"` : ''}
          </p>
        </div>
        
        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id || index} event={event} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm 
                ? `We couldn't find any events matching "${searchTerm}".` 
                : `No events available${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''} at the moment.`
              }
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(EventsPage);