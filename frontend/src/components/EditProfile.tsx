'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/UserContext'
import { Edit } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface EditProfileProps {
  seteditProfile: (isOpen: boolean) => void;
  description?: string;
  location?: string;
  phone?: number;
  darkMode?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = ({ seteditProfile }) => {
  const { user, setProfileImage, EditUserDetails } = useAuth();

  const [name, setName] = useState<string>(user?.fullname || '');
  const [description, setDescription] = useState<string>(user?.description || '');
  const [location, setLocation] = useState<string>(user?.location || '');
  const [phone, setPhone] = useState<number>(user?.phone || 0);

  const [locationResults, setLocationResults] = useState<string>('');
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    seteditProfile(false);
  }

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  useEffect(() => {
    if (!location) {
      setLocationResults('');
      return;
    }
    
    const timeout = setTimeout(() => fetchLocationData(location), 600);
    return () => clearTimeout(timeout);
  }, [location]);

  const fetchLocationData = async (placeName: string) => {
    if (!placeName.trim()) return;
    
    try {
      setIsSearchingLocation(true);
      try {
        const res = await axios.get<LocationResult[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://event-mangement-system-r4iu.onrender.com'}/api/users/search-location`,
          {
            params: { query: placeName },
            withCredentials: true,
            timeout: 3000
          }
        );
        
        if (res.data && res.data.length > 0) {
          const first = res.data[0];
          setLocationResults(first.display_name);
        } else {
          setLocationResults("No results found");
        }
      } catch (err) {
        console.log(err);
        console.log("Backend API unavailable, using Nominatim fallback");
        
        const nominatimRes = await axios.get<LocationResult[]>(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: placeName,
              format: "json",
              limit: 1
            },
            headers: {
              'User-Agent': 'EventManagementSystem/1.0'
            }
          }
        );
        
        if (nominatimRes.data && nominatimRes.data.length > 0) {
          const first = nominatimRes.data[0];
          setLocationResults(first.display_name);
        } else {
          setLocationResults("No results found");
        }
      }
    } catch (err) {
      console.error("Location search error:", err);
      setLocationResults("Error finding location.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    const updatedData = {
      email: user?.email,
      fullName: name,
      description,
      location,
      phone,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://event-mangement-system-r4iu.onrender.com';
      const response = await axios.post(
        `${apiUrl}/api/users/update-data`, 
        updatedData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        if (EditUserDetails) {
          EditUserDetails({
            ...user,
            fullname: name,
            description,
            location,
            phone,
          });
        }
        
        seteditProfile(false);
        toast.success(response.data.message || 'Profile updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    try {
      setIsUploading(true);
      await setProfileImage(file); 
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Failed to update profile picture');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // JSX is largely good, just applying the state fixes
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onMouseDown={updateProfile}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 animate-fadeIn"
        onMouseDown={closeModal}
      >
        <h1 className="text-3xl font-bold text-center mb-6">Update Profile</h1>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* ... Profile image section (no changes) ... */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`rounded-full border-2 border-black p-1 ${isUploading ? 'opacity-50' : ''}`}>
                <Image 
                  src={user?.image || '/assets/default-avatar.png'} 
                  alt="Profile" 
                  width={112}
                  height={112}
                  className="rounded-full h-28 w-28 object-cover"
                  priority
                />
              </div>
              
              <button 
                type="button"
                onClick={handleFileClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                aria-label="Change profile picture"
              >
                <Edit size={16} />
              </button>
              
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                aria-label="Upload profile picture"
              />
            </div>
          </div>


          <div className="space-y-4 text-black">
            {/* ... Name input (no changes) ... */}
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* ... Bio/Description input (no changes) ... */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="description"
                placeholder="Tell us about yourself"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                maxLength={250}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {description.length}/250 characters
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                type="number"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {location && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                  {isSearchingLocation ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching location...</span>
                    </div>
                  ) : locationResults}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => seteditProfile(false)}
              className="text-black flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || isUploading} // REFINEMENT: Also disable if uploading image
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;