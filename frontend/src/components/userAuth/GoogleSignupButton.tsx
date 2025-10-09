"use client";
import { useAuth } from "@/context/UserContext";
import Image from "next/image";
import { useState } from "react";

export default function GoogleSignupButton({isClicked, setisClicked}: {isClicked: boolean, setisClicked: React.Dispatch<React.SetStateAction<boolean>>}) {
  const { signUp } = useAuth();

  const handleGoogleSignup = () => {
    setisClicked(true);
    const BACKEND_GOOGLE_OAUTH_URL = `${process.env.BACKEND_API_KEY}/auth/google/redirect`; 
    console.log("Redirecting to Google OAuth endpoint:", BACKEND_GOOGLE_OAUTH_URL);
    window.location.href = BACKEND_GOOGLE_OAUTH_URL;
  };

  return (
    <button 
      onClick={handleGoogleSignup}
      disabled={isClicked}
      className="mt-3 w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      <Image
        src="https://res.cloudinary.com/dgxwp0k8w/image/upload/v1754219192/nju7fb8fumzh8cuxsn47.webp" 
        alt="Google" 
        width={100}
        height={100}
        className="w-fit h-7 rounded-lg" 
      />
      <p>{isClicked ? "Redirecting..." : "Sign up with Google"}</p>
    </button>
  );
}