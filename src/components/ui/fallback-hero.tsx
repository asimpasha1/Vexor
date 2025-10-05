"use client"

import { motion } from "framer-motion"

interface FallbackHeroProps {
  className?: string
}

export default function FallbackHero({ className }: FallbackHeroProps) {
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 to-purple-900 rounded-xl`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <div className="text-white text-3xl font-bold">🚀</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          ابتكار رقمي
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          حلول رقمية متطورة لنجاح أعمالك
        </p>
      </motion.div>
    </div>
  )
}