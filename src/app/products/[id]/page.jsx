"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BASE_URL from "../../../config/api";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const token = localStorage.getItem("token");

    // Check if user is logged in
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add items to your cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    // Check if size is selected
    if (!selectedSize) {
      Swal.fire({
        title: "Select Size",
        text: "Please select a size before adding to cart",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in cart with same size and color
    const existingProductIndex = cart.findIndex(
      (item) => 
        item.product_id === product.id && 
        item.size === selectedSize && 
        item.color === selectedColor
    );

    const finalPrice = product.hasOffer 
      ? parseFloat(product.final_price) 
      : parseFloat(product.original_price);

    if (existingProductIndex !== -1) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += quantity;
      Swal.fire({
        title: "Cart Updated!",
        text: `${product.name} (${selectedSize}) quantity increased to ${cart[existingProductIndex].quantity}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Add new product to cart
      const cartItem = {
        product_id: product.id,
        name: product.name,
        price: finalPrice,
        original_price: parseFloat(product.original_price),
        quantity: quantity,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        hasOffer: product.hasOffer,
      };
      cart.push(cartItem);

      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} (${selectedSize}) has been added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-900 transition-colors group"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* LEFT SIDE - IMAGE GALLERY */}
          <div className="flex gap-4">
            {/* thumbnails */}
            <div className="flex flex-col gap-3">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-lg cursor-pointer overflow-hidden border-2 transition-all ${
                    activeImage === img 
                      ? "border-blue-900 shadow-lg scale-105" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* main image */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCT INFO */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <div className="mb-2">
              <span className="text-sm text-blue-600 font-medium">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-4">
              {product.hasOffer ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl line-through text-gray-400">
                    £{parseFloat(product.original_price).toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    £{parseFloat(product.final_price).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    SAVE {((1 - product.final_price / product.original_price) * 100).toFixed(0)}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  £{parseFloat(product.original_price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Options */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {['Black', 'White', 'Gray'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-blue-900 ring-2 ring-offset-2 ring-blue-900' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      border: color === 'White' ? '1px solid #e5e7eb' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Size</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-blue-900 bg-blue-50 text-blue-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  className="text-black w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-semibold w-12 text-center text-black">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="text-black w-10 h-10 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition transform hover:scale-105 duration-300 shadow-lg"
            >
              ADD TO CART
            </button>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold text-gray-900">4.5</p>
              <div className="flex justify-center md:justify-start gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 mt-1">Based on 24 reviews</p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{star} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${star === 5 ? '80' : star === 4 ? '60' : star === 3 ? '40' : star === 2 ? '20' : '10'}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">
                    {star === 5 ? '12' : star === 4 ? '8' : star === 3 ? '3' : star === 2 ? '1' : '0'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-6">
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-medium text-gray-900 mb-1">Great quality product!</p>
              <p className="text-gray-600 text-sm">Excellent quality and fast shipping. Highly recommended!</p>
              <p className="text-gray-400 text-xs mt-2">2 days ago</p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Jane Smith</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="font-medium text-gray-900 mb-1">Good but sizing is off</p>
              <p className="text-gray-600 text-sm">Product quality is good but runs a bit small. Size up!</p>
              <p className="text-gray-400 text-xs mt-2">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}