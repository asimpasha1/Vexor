"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import ProductCard from '@/components/ui/product-card'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  featured: boolean
}

interface SwiperComponentProps {
  products: Product[]
}

export default function SwiperComponent({ products }: SwiperComponentProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }}
      className="pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}