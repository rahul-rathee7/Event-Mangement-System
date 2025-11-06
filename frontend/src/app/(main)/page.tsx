'use client';
import HeroSection from "@/components/User/HeroSection";
import AdminHeroSection from '@/app/(main)/admin/page';
import { useAuth } from "@/context/UserContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="w-full min-h-[75vh]">
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
