"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  FileText,
  Upload,
  Bell
} from "lucide-react"
import { signOut } from "next-auth/react"

const sidebarItems = [
  {
    name: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "blue"
  },
  {
    name: "المنتجات", 
    href: "/dashboard/products",
    icon: Package,
    color: "green"
  },
  {
    name: "المحادثات",
    href: "/dashboard/chat-support",
    icon: Bell,
    color: "indigo"
  },
  {
    name: "المستخدمين",
    href: "/dashboard/users", 
    icon: Users,
    color: "purple"
  },
  {
    name: "التحليلات",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "orange"
  },
  {
    name: "الطلبات",
    href: "/dashboard/orders",
    icon: FileText,
    color: "red"
  },
  {
    name: "الإشعارات",
    href: "/dashboard/notifications",
    icon: Bell,
    color: "yellow"
  },
  {
    name: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
    color: "gray"
  },
  {
    name: "إعدادات من نحن",
    href: "/dashboard/about-settings",
    icon: FileText,
    color: "indigo"
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need admin privileges to access this page.
          </p>
          <Link 
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" 
        : "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-700 dark:hover:text-blue-300",
      green: isActive 
        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700" 
        : "hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300",
      purple: isActive 
        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700" 
        : "hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-700 dark:hover:text-purple-300",
      orange: isActive 
        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700" 
        : "hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-700 dark:hover:text-orange-300",
      red: isActive 
        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700" 
        : "hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 dark:hover:text-red-300",
      yellow: isActive 
        ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700" 
        : "hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:text-yellow-700 dark:hover:text-yellow-300",
      gray: isActive 
        ? "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600" 
        : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300",
      indigo: isActive 
        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700" 
        : "hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-700 dark:hover:text-indigo-300"
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col border-r border-gray-200 dark:border-gray-700
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <Link href="/" className="flex items-center space-x-3 space-x-reverse">
            <Package className="h-8 w-8 text-white" />
            <div className="text-right">
              <span className="text-xl font-bold text-white">لوحة الإدارة</span>
              <p className="text-blue-100 text-sm">Digital Market</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md lg:hidden hover:bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              مرحباً بك، {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <nav className="px-4 pb-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border
                      ${isActive 
                        ? `${getColorClasses(item.color, true)} shadow-sm` 
                        : `${getColorClasses(item.color, false)} text-gray-600 dark:text-gray-300 border-transparent`
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-right">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-current rounded-full opacity-75"></div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="flex-1 text-right">تسجيل الخروج</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top navbar */}
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                مرحباً، {session.user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}