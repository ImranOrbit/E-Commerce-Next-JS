"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Products from "./products/page";

export default function Home() {
 
  const images = [
    {
      url: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      alt: "Casual T-Shirt & Modern Outfit - Clear HD",
      category: "T-Shirt"
    },
    {
      url: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      alt: "Premium Formal Shirt Collection - Full HD",
      category: "Shirt"
    },
     {
      url: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      alt: "Luxury Perfume & Fragrance - Premium Elegance",
      category: "Perfume"
    },
    
    {
      url: "https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      alt: "Classic Panjabi / Kurta Traditional Wear - High Resolution",
      category: "Panjabi"
    },
    
    {
      url: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      alt: "Stylish Pant / Trousers Collection - Sharp Quality",
      category: "Pant"
    },
   
  ];

  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle image load
  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = images[current].url;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
  }, [current, images]);

  return (
    <>
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[current].url})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-brightness-95"></div>

      {/* Optional loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl tracking-tight">
          Fashion <span className="text-amber-300">Essentials</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-2xl text-white/95 drop-shadow-md font-medium max-w-2xl mx-auto">
          Premium Shirts • Panjabi • T-Shirts • Trousers • Perfume
        </p>
        
        <p className="mt-2 text-sm md:text-lg text-white/80 italic">
          ✨ Full HD Clarity — Every Detail, Every Style ✨
        </p>

        {/* Shop Now Button */}
        <Link href="/products">
          <button className="mt-8 rounded-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 px-10 py-4 text-white font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            Explore Collection →
          </button>
        </Link>

        {/* Product Category Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {["👕 Shirt", "🧥 Panjabi", "👕 T-Shirt", "👖 Pant", "🌸 Perfume"].map((item, idx) => (
            <span key={idx} className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium border border-white/30">
              {item}
            </span>
          ))}
        </div>

        {/* Current Category Badge */}
        <div className="mt-6 inline-block bg-black/50 backdrop-blur-md px-5 py-2 rounded-full">
          <span className="text-white text-sm font-semibold">
            Now Showing: {images[current].category} Collection
          </span>
        </div>
      </div>

      {/* Slider Controls - Left/Right Arrows */}
      <button
        onClick={() => {
          setCurrent(current === 0 ? images.length - 1 : current - 1);
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white text-3xl md:text-4xl w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        onClick={() => {
          setCurrent((current + 1) % images.length);
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white text-3xl md:text-4xl w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots Indicator for navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
            }}
            className={`transition-all duration-300 rounded-full ${
              current === idx 
                ? "w-8 h-3 bg-white shadow-lg" 
                : "w-3 h-3 bg-white/60 hover:bg-white/90"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Image credit subtle footer */}
      <div className="absolute bottom-2 right-3 z-20 text-white/40 text-[10px] md:text-xs">
        Premium HD Collection
      </div>
    </section>
    
    <Products />
    </>
  );
}