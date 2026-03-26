"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-amber-400">Orbit Media Solution</h3>
            <p className="text-sm text-gray-300">
              Premium fashion & lifestyle destination since 2024.
              Quality products, exceptional service.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-400">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-amber-400 transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-amber-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-amber-400 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-amber-400 transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-400">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/shirt" className="text-gray-300 hover:text-amber-400 transition">
                  👕 Shirt
                </Link>
              </li>
              <li>
                <Link href="/category/panjabi" className="text-gray-300 hover:text-amber-400 transition">
                  🧥 Panjabi
                </Link>
              </li>
              <li>
                <Link href="/category/t-shirt" className="text-gray-300 hover:text-amber-400 transition">
                  👕 T-Shirt
                </Link>
              </li>
              <li>
                <Link href="/category/pant" className="text-gray-300 hover:text-amber-400 transition">
                  👖 Pant
                </Link>
              </li>
              <li>
                <Link href="/category/perfume" className="text-gray-300 hover:text-amber-400 transition">
                  🌸 Perfume
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-gray-300 hover:text-amber-400 transition">
                  💎 Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-amber-400 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-300 hover:text-amber-400 transition">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-300 hover:text-amber-400 transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-gray-300 hover:text-amber-400 transition">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition text-xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition text-xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition text-xl">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Orbit Media Solution. All rights reserved. | 
            Designed with ❤️ for fashion lovers
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-amber-400 ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}



