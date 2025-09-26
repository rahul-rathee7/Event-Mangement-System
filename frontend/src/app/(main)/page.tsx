'use client';
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs"
import axios from 'axios'
import HeroSection from "@/components/User/HeroSection";
import { useAuth } from "@/context/userContext";

export default function Home() {
  const { user } = useUser();
  const { userType } = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(!user){
      axios.post('http://localhost:5000/api/sendmail', { email: user?.emailAddresses[0].emailAddress, fullname: (user?.fullName ? user.fullName : (user?.firstName ? user.firstName : user?.lastName)), Role: userType }, {
        headers: {
          'Content-Type': 'application/json'  
        }
      }).then((res) => {
        if(res.data.message == "User created successfully") {
          alert("User created successfully and mail sent successfully");
        }
        else if(res.data.message == "User already exists") {
          alert("Login successfully");
        }
      }).catch((err) => {
        console.log(err);
      })}
    }, 100)
    return () => clearTimeout(timeoutId); 
  }, [user]);

  return (
    <div className="w-full">
      <HeroSection />
    </div>
  );
}
