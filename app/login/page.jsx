"use client"
import { useState } from "react"
import Link from 'next/link'
import { Eye, EyeOff } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in or after successful login
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Redirect admin to dashboard, others to book page
      if (session.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/home')
      }
    }
  }, [status, session, router])

  async function handleLogIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password
      })

      if (response?.error) {
        setError("Email atau kata sandi salah.")
        setLoading(false)
        return
      }

      if (response?.ok) {
        setTimeout(() => {
          // Check session one more time before redirecting
          fetch(getApiUrl('/api/auth/me'))
            .then(res => res.json())
            .then(sessionData => {
              if (sessionData?.user?.role === 'admin') {
                window.location.href = '/admin/dashboard'
              } else {
                window.location.href = '/home'
              }
            })
            .catch(() => {
              window.location.href = '/home'
            })
        }, 200)
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-linear-to-t from-[#CF9DA7] to-white flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
        {/* Left Section - Welcome */}
        <div className="hidden md:flex flex-col justify-center items-start">

          <div className="space-y-3 w-full max-w-xs">
          </div>
        </div>

        {/* Center Section - Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Masuk ke akun</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
            </div>
          )}
          <form onSubmit={handleLogIn} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Password Recovery Links */}
            <div className="flex justify-between items-center text-sm">
              <button type="button" className="text-[#B1344D] font-medium hover:text-red-600">
                Lupa Password?
              </button>
              <button type="button" className="text-gray-600 hover:text-gray-900">
                Atau Sudah Punya Akun <span className="text-[#B1344D]">Login</span>
              </button>
            </div>
            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B1344D] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
