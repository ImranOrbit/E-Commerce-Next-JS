// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard } from "react-icons/fa";
// import Swal from "sweetalert2";
// import BASE_URL from "../../config/api";

// export default function CartPage() {
//   const [cart, setCart] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [subtotal, setSubtotal] = useState(0);
//   const [shipping, setShipping] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = () => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(savedCart);
//     calculateTotals(savedCart);
//   };

//   const calculateTotals = (cartItems) => {
//     const subtotalAmount = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     const shippingAmount = subtotalAmount > 0 ? (subtotalAmount > 100 ? 0 : 10) : 0;
//     const taxAmount = subtotalAmount * 0.05; // 5% tax
//     const totalAmount = subtotalAmount + shippingAmount + taxAmount;

//     setSubtotal(subtotalAmount);
//     setShipping(shippingAmount);
//     setTax(taxAmount);
//     setTotal(totalAmount);
//   };

//   const updateCartAndNotify = (updatedCart) => {
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     setCart(updatedCart);
//     calculateTotals(updatedCart);
//     window.dispatchEvent(new Event("cartUpdated"));
//   };

//   const increaseQty = (id) => {
//     const updated = cart.map((item) =>
//       item.product_id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     updateCartAndNotify(updated);
//   };

//   const decreaseQty = (id) => {
//     const updated = cart.map((item) =>
//       item.product_id === id && item.quantity > 1
//         ? { ...item, quantity: item.quantity - 1 }
//         : item
//     );
//     updateCartAndNotify(updated);
//   };

//   const removeItem = (id, name) => {
//     Swal.fire({
//       title: "Remove Item?",
//       text: `Are you sure you want to remove "${name}" from your cart?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, remove",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const updated = cart.filter((item) => item.product_id !== id);
//         updateCartAndNotify(updated);
        
//         Swal.fire({
//           title: "Removed!",
//           text: "Item has been removed from cart.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   const clearCart = () => {
//     if (cart.length === 0) return;

//     Swal.fire({
//       title: "Clear Cart?",
//       text: "Are you sure you want to remove all items from your cart?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, clear all",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.removeItem("cart");
//         setCart([]);
//         calculateTotals([]);
//         window.dispatchEvent(new Event("cartUpdated"));
        
//         Swal.fire({
//           title: "Cleared!",
//           text: "Your cart has been cleared.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   const proceedToCheckout = () => {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       Swal.fire({
//         title: "Login Required",
//         text: "Please login to proceed to checkout",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Login Now",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           router.push("/login");
//         }
//       });
//       return;
//     }

//     router.push("/checkout");
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center max-w-md">
//           <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <FaShoppingCart className="text-5xl text-gray-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">
//             Your Cart is Empty
//           </h2>
//           <p className="text-gray-600 mb-8">
//             Looks like you haven't added any items to your cart yet. Browse our
//             products and find something you'll love!
//           </p>
//           <Link href="/products">
//             <button className="bg-blue-950 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105 shadow-lg">
//               Continue Shopping
//             </button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <Link
//             href="/products"
//             className="flex items-center gap-2 text-gray-600 hover:text-blue-950 transition"
//           >
//             <FaArrowLeft className="text-sm" />
//             <span>Continue Shopping</span>
//           </Link>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Shopping Cart
//           </h1>
//           <button
//             onClick={clearCart}
//             className="text-red-500 hover:text-red-700 transition text-sm font-semibold"
//           >
//             Clear Cart
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Cart Items */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-600">
//                 <div className="col-span-6">Product</div>
//                 <div className="col-span-2 text-center">Price</div>
//                 <div className="col-span-2 text-center">Quantity</div>
//                 <div className="col-span-2 text-right">Total</div>
//               </div>

//               <div className="divide-y divide-gray-200">
//                 {cart.map((item) => (
//                   <div
//                     key={item.product_id}
//                     className="p-6 hover:bg-gray-50 transition duration-300"
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       {/* Product Info */}
//                       <div className="flex gap-4 flex-1">
//                         <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                           {item.image ? (
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center">
//                               <FaShoppingCart className="text-gray-400 text-2xl" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-800 mb-1">
//                             {item.name}
//                           </h3>
//                           <p className="text-sm text-gray-500">
//                             {item.hasOffer ? "On Sale" : "Regular Price"}
//                           </p>
//                           <button
//                             onClick={() => removeItem(item.product_id, item.name)}
//                             className="mt-2 text-red-500 text-sm hover:text-red-700 transition flex items-center gap-1 md:hidden"
//                           >
//                             <FaTrash className="text-xs" /> Remove
//                           </button>
//                         </div>
//                       </div>

//                       {/* Price */}
//                       <div className="md:w-32 text-left md:text-center">
//                         <p className="text-gray-800 font-semibold">
//                           ${item.price.toFixed(2)}
//                         </p>
//                       </div>

//                       {/* Quantity */}
//                       <div className="md:w-32">
//                         <div className="flex items-center gap-3 justify-start md:justify-center">
//                           <button
//                             onClick={() => decreaseQty(item.product_id)}
//                             className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
//                           >
//                             <FaMinus className="text-xs" />
//                           </button>
//                           <span className="w-10 text-center font-semibold text-gray-800">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() => increaseQty(item.product_id)}
//                             className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
//                           >
//                             <FaPlus className="text-xs" />
//                           </button>
//                         </div>
//                       </div>

//                       {/* Total */}
//                       <div className="md:w-32 text-left md:text-right flex justify-between items-center">
//                         <span className="font-bold text-blue-950 text-lg">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </span>
//                         <button
//                           onClick={() => removeItem(item.product_id, item.name)}
//                           className="text-red-500 hover:text-red-700 transition hidden md:block"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Order Summary
//               </h2>
              
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span>
//                     {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax (5%)</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t pt-3 mt-3">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span className="text-blue-950">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {shipping === 0 && subtotal > 0 && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//                   <p className="text-green-700 text-sm text-center">
//                     🎉 Congratulations! You've qualified for free shipping!
//                   </p>
//                 </div>
//               )}

//               <button
//                 onClick={proceedToCheckout}
//                 className="w-full bg-blue-950 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-3"
//               >
//                 <FaCreditCard className="text-sm" />
//                 Proceed to Checkout
//               </button>

//               <Link href="/products">
//                 <button className="w-full border-2 border-blue-950 text-blue-950 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
//                   Add More Items
//                 </button>
//               </Link>

//               {/* Payment Methods */}
//               <div className="mt-6 pt-4 border-t">
//                 <p className="text-xs text-gray-500 text-center mb-3">
//                   We accept
//                 </p>
//                 <div className="flex justify-center gap-4">
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
//                     alt="Visa"
//                     className="h-8"
//                   />
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
//                     alt="Mastercard"
//                     className="h-8"
//                   />
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
//                     alt="PayPal"
//                     className="h-8"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recommended Products Section */}
//         <div className="mt-12">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">
//             You might also like
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {/* You can add recommended products here */}
//             <div className="bg-white rounded-lg shadow-md p-4 text-center">
//               <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
//                 <FaShoppingCart className="text-gray-400 text-3xl" />
//               </div>
//               <p className="text-sm text-gray-600">Recommended products coming soon</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load cart and user data (no login check)
    loadCart();
    loadUserData();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      Swal.fire({
        title: "Cart Empty",
        text: "Your cart is empty. Please add items before checkout.",
        icon: "info",
        confirmButtonText: "Shop Now",
      }).then(() => {
        router.push("/products");
      });
      return;
    }
    setCart(savedCart);
    calculateTotals(savedCart);
  };

  const loadUserData = () => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(savedUser);
  };

  const calculateTotals = (cartItems) => {
    const subtotalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const shippingAmount =
      subtotalAmount > 0 ? (subtotalAmount > 100 ? 0 : 10) : 0;
    const taxAmount = subtotalAmount * 0.05;
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;

    setSubtotal(subtotalAmount);
    setShipping(shippingAmount);
    setTax(taxAmount);
    setTotal(totalAmount);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.name?.trim()) newErrors.name = "Name is required";
    if (!user.email?.trim()) newErrors.email = "Email is required";
    if (!user.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!user.address?.trim()) newErrors.address = "Address is required";

    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    if (user.phone && !/^[0-9+\-\s]{10,15}$/.test(user.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const placeOrder = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        title: "Cart Empty",
        text: "Your cart is empty. Please add items before checkout.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    
    // Prepare order data
    const orderData = {
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_amount: total,
      shipping_address: user.address,
      phone: user.phone,
      payment_method: paymentMethod,
      customer_name: user.name,
      customer_email: user.email,
    };

    try {
      // If user is logged in, use authenticated endpoint
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });

      // Check if response is OK
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = "Failed to place order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors || "Failed to place order";
        } catch (e) {
          // If response is not JSON (like HTML error page)
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        // Clear cart
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        // Show success message
        await Swal.fire({
          title: "Order Placed Successfully! 🎉",
          html: token 
            ? "Your order has been confirmed. You can track it in your orders section."
            : `Your guest order has been placed successfully!<br/><strong>Order ID: ${data.order_id}</strong><br/><br/>Please save this order ID for tracking.`,
          icon: "success",
          confirmButtonText: "Continue Shopping",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/products");
          }
        });
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      Swal.fire({
        title: "Order Failed",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-950 transition"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Checkout
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="lg:w-2/3 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
                <div className="bg-blue-950 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-amber-400 text-lg" />
                </div>
                <span>Delivery Information</span>
              </h2>

              <div className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={user.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Address Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <textarea
                      name="address"
                      value={user.address || ""}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter your complete address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-blue-950" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <FaMoneyBillWave className="text-green-600 mr-2" />
                  <div className="flex-1">
                    <span className="font-semibold text-black">
                      Cash on Delivery
                    </span>
                    <p className="text-sm text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <FaMobileAlt className="text-pink-600 mr-2" />
                  <div className="flex-1">
                    <span className="font-semibold text-black">bKash</span>
                    <p className="text-sm text-black">
                      Pay with bKash mobile banking
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <FaCreditCard className="text-blue-600 mr-2" />
                  <div className="flex-1">
                    <span className="font-semibold text-black">
                      Credit/Debit Card
                    </span>
                    <p className="text-sm text-gray-500">
                      Visa, Mastercard, Amex
                    </p>
                  </div>
                </label>
              </div>

              {paymentMethod === "bkash" && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-800">
                    <strong>Send payment to:</strong> 01XXXXXXXXX (bKash
                    Merchant)
                  </p>
                  <p className="text-xs text-pink-600 mt-1">
                    After payment, please send the transaction ID to our
                    WhatsApp
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* Order Items Preview */}
              <div className="max-h-64 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex gap-3 mb-3 pb-3 border-b"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaShoppingCart className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × £{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-blue-950">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-black">Total</span>
                    <span className="text-blue-950">£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping === 0 && subtotal > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 text-sm text-center">
                    🎉 Free Shipping Applied!
                  </p>
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-blue-950 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}