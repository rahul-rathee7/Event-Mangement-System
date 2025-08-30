"use client";
import { useSignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function GoogleSignupButton() {
  const { signUp } = useSignUp();

  const handleGoogleSignup = () => {
    signUp?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/", 
      redirectUrlComplete: "/",
    });
  };

  return (
    <button 
      onClick={handleGoogleSignup}
      className="mt-3 w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition"
    >
      <Image
        src="https://res.cloudinary.com/dgxwp0k8w/image/upload/v1754219192/nju7fb8fumzh8cuxsn47.webp" 
        alt="Google" 
        width={100}
        height={100}
        className="w-fit h-7 rounded-lg" 
      />
      <p>Sign up with Google</p>
    </button>
  );
}