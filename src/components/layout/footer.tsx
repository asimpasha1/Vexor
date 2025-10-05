"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Instagram, Mail, Heart } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

export default function Footer() {
  const { siteName, siteDescription, loading } = useSettings()
  
  return (
    <footer className="bg-white/5 dark:bg-black/5 backdrop-blur-md border-t border-white/10 dark:border-white/5">
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {loading ? "DigitalMarket" : siteName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {loading ? "Your premier destination for high-quality digital products. Discover, create, and innovate with our curated collection." : siteDescription}
            </p>
            <div className="flex space-x-4">
              <div className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                <Github className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-purple-500 transition-colors cursor-pointer">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-green-500 transition-colors cursor-pointer">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=ebooks" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  E-books
                </Link>
              </li>
              <li>
                <Link href="/products?category=courses" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Online Courses
                </Link>
              </li>
              <li>
                <Link href="/products?category=templates" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/products?category=software" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Software
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 dark:border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 {loading ? "DigitalMarket" : siteName}. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-gray-600 dark:text-gray-400 text-sm">by Your Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}