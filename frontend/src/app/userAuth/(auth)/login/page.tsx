'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/context/UserContext'
import GoogleLoginButton from "@/components/userAuth/GoogleLoginButton"

const Page = () => {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { useSignIn, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!useSignIn.isLoaded) return
    setLoading(true)

    try {
      const result = await useSignIn.create({
        emailAddress: form.email,
        password: form.password,
      })
      if (result.status === "complete") {
        console.log("Login successful")
        router.push("/")
      } else {
        console.log("Additional steps required:", result.status)
        router.push("/userAuth/login/verify-otp")
      }

    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const forgetPassword = () => {
    router.push("/userAuth/forget-password")
  }

  return (
    <div className="flex items-center justify-center px-4 text-black w-full translate-y-1/3">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 outline rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="text-right text-sm text-indigo-700">
            <button type="button" onClick={forgetPassword}>Forget Password?</button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <GoogleLoginButton />

        <p className="text-sm text-gray-600 text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/userAuth/register" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page
