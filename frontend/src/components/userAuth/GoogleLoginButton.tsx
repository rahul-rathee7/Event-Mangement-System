"use client";
import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function GoogleLoginButton() {
  const { signIn } = useSignIn();

  const handleGoogleLogin = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="w-full mt-3 flex justify-center items-center gap-2 bg-blue-600 hover:bg-red-600 text-white px-5 py-3 rounded-xl"
    >
      <Image src={"https://res.cloudinary.com/dgxwp0k8w/image/upload/v1754219192/nju7fb8fumzh8cuxsn47.webp"} alt="Google" className="w-fit h-5 rounded-lg" width={100} height={100}/>
      Sign in with Google
    </button>
  );
}
