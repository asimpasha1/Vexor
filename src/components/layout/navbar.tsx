"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "@/components/providers/theme-provider"
import { Moon, Sun, ShoppingBag, User, LogOut, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useSiteName } from "@/hooks/useSettings"
import UnifiedNotificationCenter from "@/components/UnifiedNotificationCenter"

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { siteName, loading } = useSiteName()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <ShoppingBag className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {loading ? 'DigitalMarket' : siteName}
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Unified Notification Center - للاختبار */}
            <UnifiedNotificationCenter />
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('🎯 Current theme before toggle:', theme) // للتشخيص
                
                // تبديل بسيط بين light و dark
                const newTheme = theme === "dark" ? "light" : "dark"
                
                console.log(`🎨 Toggling theme from ${theme} to ${newTheme}`) // للتشخيص
                setTheme(newTheme)
                
                // التحقق من تطبيق الثيم بعد قليل
                setTimeout(() => {
                  const root = document.documentElement
                  const body = document.body
                  console.log('📄 Root classes after click:', root.className)
                  console.log('📄 Body classes after click:', body.className)
                  console.log('📱 New theme state should be:', newTheme)
                }, 300)
              }}
              className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
              title={mounted ? (theme === "dark" ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع المظلم") : "تبديل الثيم"}
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-6 w-6 text-yellow-500 hover:text-yellow-400 transition-colors drop-shadow-lg" />
                ) : (
                  <Moon className="h-6 w-6 text-blue-600 hover:text-blue-500 transition-colors drop-shadow-lg" />
                )
              ) : (
                <div className="h-6 w-6 bg-gray-400 rounded animate-pulse" />
              )}
            </motion.button>

            {/* User Menu */}
            {session ? (
              <div className="flex items-center space-x-4">
                {/* User Dropdown Menu */}
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user?.role === "ADMIN" ? "Admin" : "User"}
                      </div>
                    </div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      
                      {(session.user as any)?.role === "ADMIN" && (
                        <>
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </>
                      )}
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-600" />
                      
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login/Register Buttons */}
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}