"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  featured: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3 }
        }}
        className={cn(
          "group relative overflow-hidden rounded-2xl backdrop-blur-md cursor-pointer",
          "bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10",
          "hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300",
          className
        )}
      >
      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.image || "/placeholder-product.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Download className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-500 dark:text-blue-400 uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <Star className="h-3 w-3 text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <span>عرض التفاصيل</span>
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-sm" />
        <div className="absolute inset-px rounded-2xl bg-white/5 dark:bg-black/5" />
      </div>
    </motion.div>
    </Link>
  )
}