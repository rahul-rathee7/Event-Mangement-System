'use client';

import { useAuth } from "@/context/UserContext";

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
      <AppContent>{children}</AppContent>
  );
}