'use client';

import { AuthProvider, useAuth } from "@/context/UserContext";
import { EventContextProvider } from "@/context/EventContext";

function AppContent({ children }: { children: React.ReactNode }) {
  const { datafetched } = useAuth();

  if (!datafetched) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EventContextProvider>
        <AppContent>{children}</AppContent>
      </EventContextProvider>
    </AuthProvider>
  );
}