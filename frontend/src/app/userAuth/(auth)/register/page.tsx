'use client'
import React, { useState } from "react"
import { useAuth } from "@/context/UserContext"
import GoogleSignupButton from "@/components/userAuth/GoogleSignupButton"

const Page = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const { useSignUp, isSignedup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [isClicked, setisClicked] = useState(false);
  const [role, setRole] = useState("user");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignUp = async () => {
    if (!useSignUp.create) return;
    await useSignUp.create({
      emailAddress: form.email,
      password: form.password,
      fullname: form.name,
      role: role
    })
  }
  
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    try {
      await handleSignUp();
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 text-black w-full translate-y-1/4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 outline rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 outline rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 outline rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex items-center space-x-5">
            <div className="flex items-center gap-1">
              <input type="radio" name="userType" value="user" id="user" defaultChecked onChange={() => setRole("user")} />
              <label htmlFor="user">User</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="radio" name="userType" value="organizer" id="organizer" onChange={() => setRole("admin")} />
              <label htmlFor="organizer">Organizer</label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSignedup ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <GoogleSignupButton isClicked={isClicked} setisClicked={setisClicked} />
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/userAuth/login" className="text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page
