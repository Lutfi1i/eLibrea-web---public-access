"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { storedUSer } from "@/lib/action"
import { motion } from "framer-motion"

export default function Page() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="min-h-screen bg-linear-to-t from-[#CF9DA7] to-white flex items-center justify-center p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1440px] w-full">
        {/* Left Section - Welcome */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="hidden md:flex flex-col justify-center items-start "
        >
          <div className="mb-5">
            <h1 className="text-[45px] font-semibold text-gray-900">
              Kamu baru <br />disini?{" "}
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                --&gt;
              </motion.span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-500 text-[15px] mb-80 italic"
          >
            &quot;Register berguna untuk <br />mengenal diri mu&quot;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="space-y-3 w-full max-w-xs"
          >
            <p className="text-gray-600 text-sm mt-8">atau daftar instan dengan,</p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full flex items-center justify-center gap-3 bg-white rounded-lg px-4 py-3 font-medium text-gray-900 hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full flex items-center justify-center gap-3 bg-white rounded-lg px-4 py-3 font-medium text-gray-900 hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </motion.button>
          </motion.div>

        </motion.div>

        {/* Center Section - Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="bg-white w-l rounded-xl shadow-lg p-10 border border-gray-200 justify-center items-center w-8xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-15 mt-5">Buat Akun</h2>

          <form action={storedUSer} className="space-y-8">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Username</label>
              <input
                type="username"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-4 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-4 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-4 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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

            {/* Links */}
            <div className="flex justify-between items-center text-sm">
              <button type="button" className="text-[#B1344D] font-medium hover:text-red-600">
                Lupa Password?
              </button>
              <button type="button" className="text-gray-600 hover:text-gray-900">
                Atau Sudah Punya Akun <span className="text-[#B1344D]">Login</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="submit"
              className="w-full bg-[#B1344D] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-shadow"
            >
              Daftar
            </motion.button>
          </form>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="hidden md:flex flex-col justify-center items-start "
        >
          <div className="mb-5">
            <h1 className="text-[45px] font-semibold text-gray-900">
              Kamu baru <br />disini?{" "}
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                --&gt;
              </motion.span>
            </h1>
          </div>


        </motion.div>
      </div>
    </motion.div>
  )
}
