'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, Calendar, MapPin, Shield, Bell, 
  Settings, Key, LogOut, Edit, Camera, CheckCircle,
  Clock, AlertTriangle, Activity, Zap, Moon, Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'

// Shimmer loading effect component
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${className}`}></div>
)

// Tabs for profile sections
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
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

// Activity log item component
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

// Setting item component
const SettingItem = ({ title, description, children }) => (
  <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
    {children}
  </div>
)

// Stats card component
const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center text-center border border-gray-100 dark:border-gray-700"
  >
    <div className={`p-3 rounded-full ${color} mb-3`}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </motion.div>
)

// Main profile component
const ProfilePage = () => {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [userData, setUserData] = useState(null)
  const [activities, setActivities] = useState([])
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserData({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        role: 'Administrator',
        joinDate: 'May 15, 2023',
        avatar: '/avatars/admin-profile.jpg',
        twoFactorEnabled: true,
        stats: {
          eventsCreated: 42,
          totalUsers: 128,
          pendingRequests: 7
        }
      })
      
      setActivities([
        { 
          id: 1, 
          description: 'Updated system settings', 
          time: '2 hours ago',
          icon: <Settings size={16} className="text-blue-500" />,
          color: 'bg-blue-100 dark:bg-blue-900/30'
        },
        { 
          id: 2, 
          description: 'Approved event: "Tech Conference 2025"', 
          time: 'Yesterday at 2:30 PM',
          icon: <CheckCircle size={16} className="text-green-500" />,
          color: 'bg-green-100 dark:bg-green-900/30'
        },
        { 
          id: 3, 
          description: 'Changed account password', 
          time: '2 days ago',
          icon: <Key size={16} className="text-amber-500" />,
          color: 'bg-amber-100 dark:bg-amber-900/30'
        },
        { 
          id: 4, 
          description: 'System maintenance scheduled', 
          time: '5 days ago',
          icon: <Clock size={16} className="text-purple-500" />,
          color: 'bg-purple-100 dark:bg-purple-900/30'
        },
        { 
          id: 5, 
          description: 'Rejected event: "Unofficial Gathering"', 
          time: '1 week ago',
          icon: <AlertTriangle size={16} className="text-red-500" />,
          color: 'bg-red-100 dark:bg-red-900/30'
        }
      ])
      
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </motion.button>
        </div>
      </motion.div>
      
      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Profile header with background and avatar */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end">
                <div className="relative">
                  {loading ? (
                    <Shimmer className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800" />
                  ) : (
                    <div className="relative h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                      <Image 
                        src="/avatars/admin-profile.jpg" 
                        alt="Profile picture"
                        width={96}
                        height={96}
                        className="object-cover"
                        priority
                      />
                      <button className="absolute bottom-0 right-0 p-1 rounded-full bg-gray-800/70 text-white hover:bg-gray-900">
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
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userData?.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userData?.role}</p>
                    </>
                  )}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 sm:mt-0 mb-3 sm:mb-6 px-4 py-2 bg-white dark:bg-gray-700 rounded-md shadow text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </motion.button>
            </div>
          </div>
          
          {/* Stats section */}
          <div className="pt-16 px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <Shimmer key={i} className="h-28 rounded-xl" />
                ))
              ) : (
                <>
                  <StatCard 
                    icon={<Calendar size={20} className="text-blue-500" />}
                    label="Events Created" 
                    value={userData?.stats.eventsCreated}
                    color="bg-blue-100 dark:bg-blue-900/30"
                  />
                  <StatCard 
                    icon={<User size={20} className="text-green-500" />}
                    label="Total Users" 
                    value={userData?.stats.totalUsers}
                    color="bg-green-100 dark:bg-green-900/30"
                  />
                  <StatCard 
                    icon={<Zap size={20} className="text-amber-500" />}
                    label="Pending Requests" 
                    value={userData?.stats.pendingRequests}
                    color="bg-amber-100 dark:bg-amber-900/30"
                  />
                </>
              )}
            </div>
            
            {/* Profile tabs */}
            <div className="mt-8">
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Personal Info Tab */}
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
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-4">
                              <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                              <p className="text-md font-medium text-gray-900 dark:text-white mt-1">{userData?.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md mr-4">
                              <Phone size={20} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                              <p className="text-md font-medium text-gray-900 dark:text-white mt-1">{userData?.phone}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md mr-4">
                              <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                              <p className="text-md font-medium text-gray-900 dark:text-white mt-1">{userData?.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md mr-4">
                              <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                              <p className="text-md font-medium text-gray-900 dark:text-white mt-1">{userData?.joinDate}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h3>
                      
                      {loading ? (
                        <div className="space-y-4">
                          {Array(3).fill(0).map((_, i) => (
                            <Shimmer key={i} className="h-20 w-full rounded" />
                          ))}
                        </div>
                      ) : (
                        <div>
                          <SettingItem
                            title="Password"
                            description="Last changed 3 months ago"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              Change
                            </motion.button>
                          </SettingItem>
                          
                          <SettingItem
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                          >
                            <div className="flex items-center">
                              <div className={`mr-3 text-sm ${userData?.twoFactorEnabled ? 'text-green-500' : 'text-gray-500'}`}>
                                {userData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                              </div>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                  type="checkbox" 
                                  name="toggle" 
                                  id="toggle" 
                                  checked={userData?.twoFactorEnabled}
                                  className="sr-only peer"
                                />
                                <label 
                                  htmlFor="toggle" 
                                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer peer-checked:bg-blue-500`}
                                >
                                  <span className={`absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${userData?.twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                </label>
                              </div>
                            </div>
                          </SettingItem>
                          
                          <SettingItem
                            title="Login Sessions"
                            description="Manage your active sessions on different devices"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              Sign out all
                            </motion.button>
                          </SettingItem>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                      
                      {loading ? (
                        <div className="space-y-4">
                          {Array(4).fill(0).map((_, i) => (
                            <Shimmer key={i} className="h-16 w-full rounded" />
                          ))}
                        </div>
                      ) : (
                        <div>
                          <SettingItem
                            title="Email Notifications"
                            description="Receive emails about event updates and system notifications"
                          >
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input 
                                type="checkbox" 
                                name="email_toggle" 
                                id="email_toggle" 
                                defaultChecked={true}
                                className="sr-only peer"
                              />
                              <label 
                                htmlFor="email_toggle" 
                                className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer peer-checked:bg-blue-500"
                              >
                                <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                              </label>
                            </div>
                          </SettingItem>
                          
                          <SettingItem
                            title="Push Notifications"
                            description="Receive push notifications on your device"
                          >
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input 
                                type="checkbox" 
                                name="push_toggle" 
                                id="push_toggle" 
                                defaultChecked={true}
                                className="sr-only peer"
                              />
                              <label 
                                htmlFor="push_toggle" 
                                className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer peer-checked:bg-blue-500"
                              >
                                <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                              </label>
                            </div>
                          </SettingItem>
                          
                          <SettingItem
                            title="Event Reminders"
                            description="Get notified before events you're managing"
                          >
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input 
                                type="checkbox" 
                                name="reminder_toggle" 
                                id="reminder_toggle" 
                                defaultChecked={true}
                                className="sr-only peer"
                              />
                              <label 
                                htmlFor="reminder_toggle" 
                                className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer peer-checked:bg-blue-500"
                              >
                                <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                              </label>
                            </div>
                          </SettingItem>
                          
                          <SettingItem
                            title="Marketing Communications"
                            description="Receive updates about new features and promotions"
                          >
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input 
                                type="checkbox" 
                                name="marketing_toggle" 
                                id="marketing_toggle" 
                                defaultChecked={false}
                                className="sr-only peer"
                              />
                              <label 
                                htmlFor="marketing_toggle" 
                                className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer peer-checked:bg-blue-500"
                              >
                                <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                              </label>
                            </div>
                          </SettingItem>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Activity Tab */}
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
                          {activities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} />
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                          View Full Activity Log
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Additional custom styling */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default ProfilePage