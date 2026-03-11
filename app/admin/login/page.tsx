"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("id", data.user.id)
      .eq("is_active", true)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      setError("You do not have admin access.")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#fffbf5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <Image
              src="/pees-bakery-logo.png"
              alt="Pee's Bakery Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white border border-[#e5e7e8] rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0f1419]">Admin Portal</h1>
            <p className="text-[#5c6466] text-sm mt-1">
              Sign in to manage Pee&apos;s Bakery &amp; Restaurant
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f1419] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                placeholder="admin@peesbakery.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0f1419] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7e8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014325] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#014325] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#012d19] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-[#5c6466] mt-6">
            This portal is for authorized staff only.
          </p>
        </div>
      </div>
    </div>
  )
}
