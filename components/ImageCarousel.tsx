'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className="w-full h-full relative group bg-slate-100">
      <div className="w-full h-full flex items-center justify-center relative">
        <img 
          src={images[currentIndex]} 
          alt={alt || 'Product image'}
          className="max-w-full max-h-full object-contain"
        />
        {/* Overlay para garantir legibilidade de textos se houver, ou apenas estético */}
        <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
      </div>

      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
        <ChevronLeft onClick={prevSlide} size={30} />
      </div>

      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
        <ChevronRight onClick={nextSlide} size={30} />
      </div>

      {/* Dots */}
      <div className="flex top-4 justify-center py-2 gap-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 ${
              currentIndex === slideIndex ? 'text-indigo-600 scale-125' : 'text-slate-300'
            }`}
          >
            •
          </div>
        ))}
      </div>
    </div>
  )
}
