import { type Metadata } from 'next'
import { AuthProvider } from '@/context/UserContext';
import '../../(main)/globals.css'

export const metadata: Metadata = {
  title: 'Eventify',
  description: 'This is an Event Management System',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
      </header>
      {children}
    </div>
  );
}


