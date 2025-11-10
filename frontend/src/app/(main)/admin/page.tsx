'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/context/UserContext'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Activity, TrendingUp, AlertCircle, CheckCircle, ArrowRight, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// ...existing code...

const Analytics = dynamic(() => import('@/components/admin/AnalyticsComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-44 rounded-xl bg-white dark:bg-gray-800 animate-pulse" aria-hidden />
  )
})

const StatCard = React.memo(({ title, value, icon, color, change, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28 }}
    className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow duration-300`}
    role="group"
    aria-label={title}
  >
    {isLoading ? (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('border', 'bg').replace('-500', '-100')} ${color.replace('border', 'text')}`}>
            {icon}
          </div>
        </div>
        {typeof change === 'number' && (
          <div className="mt-3 flex items-center">
            <span className={change > 0 ? "text-green-500" : "text-red-500"}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <TrendingUp className={`h-4 w-4 ml-1 ${change > 0 ? "text-green-500" : "text-red-500"}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        )}
      </>
    )}
  </motion.div>
));
StatCard.displayName = 'StatCard';

const EventRow = React.memo(({ event, isLoading }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.18 }}
    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
  >
    {isLoading ? (
      <div className="w-full animate-pulse flex items-center justify-between">
        <div className="space-y-2 max-w-xs">
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ) : (
      <>
        <div className="flex items-center">
          <div className="mr-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold">
              {event.title?.charAt(0) ?? 'E'}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="inline h-3 w-3 mr-1" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${event.status === 'Approved' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : event.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {event.status === 'Approved' ? <CheckCircle className="mr-1 h-3 w-3" /> : 
             event.status === 'Pending' ? <Clock className="mr-1 h-3 w-3" /> : 
             <AlertCircle className="mr-1 h-3 w-3" />}
            {event.status}
          </span>
        </div>
      </>
    )}
  </motion.div>
));
EventRow.displayName = 'EventRow';

const QuickActionButton = React.memo(({ icon, title, description, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-start p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-all duration-300 w-full text-left`}
    aria-label={title}
  >
    <div className={`mr-3 p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </motion.button>
));
QuickActionButton.displayName = 'QuickActionButton';

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    pendingEvents: 0
  });

  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    let mounted = true;

    // fetch minimal data, defer heavy stuff (analytics) to idle
    const fetchSummary = async () => {
      try {
        // Replace with real API call; lightweight response expected
        const data = await new Promise(resolve => {
          setTimeout(() => resolve({
            stats: { totalEvents: 42, totalUsers: 128, pendingEvents: 3 },
            recent: [
              { id: 1, title: 'Tech Fest 2025', date: '2025-10-10', status: 'Approved' },
              { id: 2, title: 'Music Night', date: '2025-10-12', status: 'Pending' },
              { id: 3, title: 'Sports Meet', date: '2025-10-15', status: 'Approved' }
            ]
          }), 350) // faster simulated fetch
        })

        if (!mounted) return;
        // @ts-ignore
        setStats(data.stats)
        // @ts-ignore
        setRecentEvents(data.recent)
        setIsLoading(false)

        // defer non-critical work
        if ('requestIdleCallback' in window) {
          // @ts-ignore
          requestIdleCallback(() => {
            // dynamically loaded analytics will render when needed
          })
        }
      } catch (err) {
        // graceful fallback
        if (!mounted) return;
        setIsLoading(false)
      }
    }

    fetchSummary()
    return () => { mounted = false }
  }, [user?.role]);

  // Navigation handlers memoized to avoid re-renders
  const handleCreateEvent = useCallback(() => {
    router.push('/admin/create-event')
  }, [router])

  const handleManageUsers = useCallback(() => {
    router.push('/admin/users')
  }, [router])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{greeting}</h2>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-4"
        >
          <Link href="/admin/create-event" prefetch={false}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                aria-label="Create new event"
              >
                <PlusCircle size={18} />
                New Event
              </motion.button>
          </Link>
          
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user?.name || 'Admin'} 
                width={40} 
                height={40}
                className="object-cover"
                priority={false}
              />
            ) : (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {(user?.name || 'A').charAt(0)}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Events" 
          value={stats.totalEvents} 
          icon={<Calendar size={20} />} 
          color="border-blue-500" 
          change={12} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Registered Users" 
          value={stats.totalUsers} 
          icon={<Users size={20} />} 
          color="border-green-500" 
          change={8} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingEvents} 
          icon={<Clock size={20} />} 
          color="border-amber-500" 
          change={-2} 
          isLoading={isLoading}
        />
      </div>

      {/* Light-weight Analytics (lazy loaded) */}
      <Analytics />

      {/* Recent Events Section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Events</h2>
          <Link href="/admin/events" prefetch={false}>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline">
              View all <ArrowRight size={16} className="ml-1" />
            </span>
          </Link>
        </div>
        
        <div className="space-y-1">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <EventRow key={i} isLoading={true} event={{}} />)
          ) : (
            recentEvents.map(event => <EventRow key={event.id} event={event} isLoading={false} />)
          )}
        </div>
      </motion.div>
      
      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton 
          icon={<PlusCircle size={20} className="text-blue-600 dark:text-blue-400" />}
          title="Create Event" 
          description="Add a new event to the platform" 
          onClick={handleCreateEvent}
          color="bg-blue-100 dark:bg-blue-900/20"
        />
        <QuickActionButton 
          icon={<Users size={20} className="text-green-600 dark:text-green-400" />}
          title="Manage Users" 
          description="View and manage user accounts" 
          onClick={handleManageUsers}
          color="bg-green-100 dark:bg-green-900/20"
        />
        <QuickActionButton 
          icon={<AlertCircle size={20} className="text-amber-600 dark:text-amber-400" />}
          title="Review Pending" 
          description={`${stats.pendingEvents} events waiting for review`}
          onClick={() => router.push('/admin/reviews')}
          color="bg-amber-100 dark:bg-amber-900/20"
        />
        <QuickActionButton 
          icon={<Activity size={20} className="text-purple-600 dark:text-purple-400" />}
          title="View Analytics" 
          description="Performance metrics and insights" 
          onClick={() => router.push('/admin/analytics')}
          color="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>
    </div>
  )
}

export default React.memo(Page)