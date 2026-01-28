'use client'

import Navbar from "@/components/shared/Navbar";
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/context/UserContext';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if(user?.role !== 'admin') {
        return (
            <div className='min-h-screen flex flex-col'>
                <Navbar />
                <main className='flex-grow flex items-center justify-center'>
                    <h1 className='text-2xl font-bold'>Access Denied</h1>
                </main>
                <Footer />
            </div>
        );
    }
  return (
    <div className=''>
      {children}
    </div>
  );
}