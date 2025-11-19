'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, Calendar, MapPin, Settings, Key, LogOut, Edit, Camera, CheckCircle,
  Clock, AlertTriangle, Activity, Zap, Moon, Sun
} from 'lucide-react'
import { useAuth } from "@/context/UserContext"
import axios from 'axios'
import EditProfile from '@/components/EditProfile'

const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${className}`} />
)

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={16} /> }
  ]

  return (
    <div className="flex overflow-x-auto hide-scrollbar space-x-2 sm:space-x-4 mb-6 pb-1">
      {tabs.map(tab => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

const ActivityItem = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 p-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
  >
    <div className={`p-2 rounded-full ${activity.color}`}>
      {activity.icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
      <p className="text-xs text-gray-500">{activity.time}</p>
    </div>
  </motion.div>
)


const ProfilePage = () => {
  const { user } = useAuth() || {}
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [activities, setActivities] = useState([])

  const [localUser, setLocalUser] = useState(user ?? null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities([
        { id: 1, description: 'Updated system settings', time: '2 hours ago', icon: <Settings size={16} className="text-blue-500" />, color: 'bg-blue-100 dark:bg-blue-900/30' },
        { id: 2, description: 'Approved event: "Tech Conference 2025"', time: 'Yesterday at 2:30 PM', icon: <CheckCircle size={16} className="text-green-500" />, color: 'bg-green-100 dark:bg-green-900/30' },
        { id: 3, description: 'Changed account password', time: '2 days ago', icon: <Key size={16} className="text-amber-500" />, color: 'bg-amber-100 dark:bg-amber-900/30' },
        { id: 4, description: 'System maintenance scheduled', time: '5 days ago', icon: <Clock size={16} className="text-purple-500" />, color: 'bg-purple-100 dark:bg-purple-900/30' },
        { id: 5, description: 'Rejected event: "Unofficial Gathering"', time: '1 week ago', icon: <AlertTriangle size={16} className="text-red-500" />, color: 'bg-red-100 dark:bg-red-900/30' }
      ])
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setLocalUser(user ?? null)
  }, [user])

  const openEdit = () => {
    setEditOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end">
                <div className="relative">
                  {loading ? (
                    <Shimmer className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800" />
                  ) : (
                    <div className="relative h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                      <Image
                        src={localUser?.image || '/assets/user.png'}
                        alt={`${localUser?.fullname || 'User'} Avatar`}
                        width={96}
                        height={96}
                        className="object-cover"
                        priority
                      />
                      <button onClick={openEdit} className="absolute bottom-0 right-0 p-1 rounded-full bg-gray-800/70 text-white hover:bg-gray-900">
                        <Camera size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4 mb-3">
                  {loading ? (
                    <div className="space-y-2">
                      <Shimmer className="h-6 w-32 rounded" />
                      <Shimmer className="h-4 w-24 rounded" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{localUser?.fullname}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{localUser?.role}</p>
                    </>
                  )}
                </div>
              </div>
              <motion.button onClick={openEdit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 sm:mt-0 mb-3 sm:mb-6 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Edit size={16} className="mr-2" /> Edit Profile
              </motion.button>
            </div>
          </div>
          
          <div className="pt-16 px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            </div>

            <div className="mt-8">
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  
                  {activeTab === 'personal' && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                      {loading ? (
                        <div className="space-y-4">
                          {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-4">
                              <Shimmer className="h-10 w-10 rounded" />
                              <div className="flex-1">
                                <Shimmer className="h-4 w-24 rounded mb-2" />
                                <Shimmer className="h-6 w-full rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-4"><Mail size={20} className="text-blue-600 dark:text-blue-400" /></div>
                            <div><p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p><p className="text-md font-medium text-gray-900 dark:text-white mt-1">{localUser?.email}</p></div>
                          </div>
                          <div className="flex items-start">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md mr-4"><Phone size={20} className="text-green-600 dark:text-green-400" /></div>
                            <div><p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p><p className="text-md font-medium text-gray-900 dark:text-white mt-1">{localUser?.phone || 'N/A'}</p></div>
                          </div>
                          <div className="flex items-start">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md mr-4"><MapPin size={20} className="text-purple-600 dark:text-purple-400" /></div>
                            <div><p className="text-sm text-gray-500 dark:text-gray-400">Location</p><p className="text-md font-medium text-gray-900 dark:text-white mt-1">{localUser?.location || 'N/A'}</p></div>
                          </div>
                          <div className="flex items-start">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md mr-4"><Calendar size={20} className="text-amber-600 dark:text-amber-400" /></div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                              <p className="text-md font-medium text-gray-900 dark:text-white mt-1">
                                {localUser?.createdAt ? new Date(localUser.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'activity' && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                      {loading ? (
                        <div className="space-y-4">
                          {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-4">
                              <Shimmer className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Shimmer className="h-4 w-full rounded mb-2" />
                                <Shimmer className="h-3 w-20 rounded" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {activities.map(activity => (<ActivityItem key={activity.id} activity={activity} />))}
                        </div>
                      )}
                      <div className="mt-6 text-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">View Full Activity Log</motion.button>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {editOpen && ( 
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
                seteditProfile={setEditOpen} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  )
}

export default ProfilePage