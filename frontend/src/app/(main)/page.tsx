'use client';
import HeroSection from "@/components/User/HeroSection";
import AdminHeroSection from '@/components/Admin/AdminHeroSection';
import { useAuth } from "@/context/UserContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="w-full">
      {
        user?.role == "admin" ? (
          <AdminHeroSection />
        ) : (
          <HeroSection />
        )
      }
    </div>
  );
}
