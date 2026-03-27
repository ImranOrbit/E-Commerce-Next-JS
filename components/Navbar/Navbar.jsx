

// "use client";

// import Link from "next/link";
// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
// import Swal from "sweetalert2";
// import Image from "next/image";
// import BASE_URL from "../../src/config/api";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [hasMounted, setHasMounted] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const dropdownRef = useRef(null);
//   const router = useRouter();
//   const [user, setUser] = useState({ name: "", email: "", profile_image: "" });

//   // Function to load cart count from localStorage
//   const loadCartCount = () => {
//     if (typeof window !== "undefined") {
//       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//       const totalItems = cart.reduce(
//         (sum, item) => sum + (item.quantity || 1),
//         0,
//       );
//       setCartCount(totalItems);
//     }
//   };

//   // Fetch user info from localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//         } catch (err) {
//           console.error("Error parsing user from localStorage:", err);
//         }
//       }

//       const token = localStorage.getItem("token");
//       if (token) {
//         fetchUserProfile();
//       }
//     }
//   }, [isLoggedIn]);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const response = await fetch(`${BASE_URL}/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           const userData = {
//             name: data.data.name || "",
//             email: data.data.email || "",
//             profile_image: data.data.profile_image || data.data.image || "",
//           };
//           setUser(userData);
//           localStorage.setItem("user", JSON.stringify(userData));
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   useEffect(() => {
//     setHasMounted(true);
//     checkLoginStatus();
//     loadCartCount(); // Load cart count on mount

//     // Listen for cart updates
//     const handleCartUpdate = () => {
//       loadCartCount();
//     };

//     window.addEventListener("cartUpdated", handleCartUpdate);

//     // Listen for storage changes (when cart is updated in another tab)
//     window.addEventListener("storage", (e) => {
//       if (e.key === "cart") {
//         loadCartCount();
//       }
//     });

//     // Click outside to hide dropdown
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       window.removeEventListener("cartUpdated", handleCartUpdate);
//     };
//   }, []);

//   // Login status check function
//   const checkLoginStatus = () => {
//     if (typeof window !== "undefined") {
//       const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(loggedIn);

//       if (loggedIn) {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           try {
//             setUser(JSON.parse(storedUser));
//           } catch (err) {
//             console.error("Error parsing user:", err);
//           }
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     const handleProfileUpdate = () => {
//       checkLoginStatus();
//       fetchUserProfile();
//     };

//     window.addEventListener("profile-updated", handleProfileUpdate);

//     return () => {
//       window.removeEventListener("profile-updated", handleProfileUpdate);
//     };
//   }, []);

//   // Update login status when localStorage changes
//   useEffect(() => {
//     const handleStorageChange = () => {
//       checkLoginStatus();
//     };

//     window.addEventListener("storage", handleStorageChange);

//     // Check login status periodically
//     const interval = setInterval(checkLoginStatus, 1000);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, logout",
//     });

//     if (result.isConfirmed) {
//       // Clear localStorage first
//       localStorage.removeItem("isLoggedIn");
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       // Don't clear cart on logout - keep cart items

//       // Update state
//       setIsLoggedIn(false);
//       setShowDropdown(false);
//       loadCartCount(); // Reload cart count after logout

//       // Trigger storage event manually to notify Dashboard
//       window.dispatchEvent(new Event("storage"));

//       // Navigate to home immediately
//       router.push("/");

//       // Success message
//       Swal.fire({
//         title: "Logged Out!",
//         text: "You have been logged out successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     }
//   };

//   if (!hasMounted) return null;

//   return (
//     <nav className="w-full bg-black shadow-md border-b border-amber-400/20">
//       <div className="mx-auto max-w-7xl px-5">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="/images/logo1.png"
//               alt="Health & Beauty"
//               width={60}
//               height={20}
//               className="rounded-full border-amber-400"
//             />
//           </Link>

//           {/* Desktop Menu -*/}
//           <ul className="hidden md:flex flex-1 justify-center items-center gap-8 text-md font-medium">
//             <Link
//               href="/"
//               className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
//             >
//               Home
//             </Link>
//             <Link
//               href="/products"
//               className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
//             >
//               Products
//             </Link>
//             <Link
//               href="/about"
//               className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
//             >
//               About
//             </Link>
//             <Link
//               href="/contact"
//               className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
//             >
//               Contact
//             </Link>
//           </ul>

//           {/* Desktop Right Side */}
//           <div className="hidden md:flex items-center gap-6">
//             <Link href="/cart">
//               <div className="relative">
//                 <FaShoppingCart className="text-amber-400 text-xl hover:text-amber-500 transition cursor-pointer" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
//                     {cartCount > 99 ? "99+" : cartCount}
//                   </span>
//                 )}
//               </div>
//             </Link>
//             <Link href="/Buy">
//               <button
//                 type="button"
//                 className="relative rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black cursor-pointer hover:bg-amber-500 transition duration-300 shadow-md flex items-center justify-center"
//               >
//                 Buy
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {cartCount > 99 ? "99+" : cartCount}
//                   </span>
//                 )}
//               </button>
//             </Link>

//             {!isLoggedIn ? (
//               <Link href="/login">
//                 <button className="rounded-full bg-amber-400 px-5 py-2 text-sm text-black font-semibold cursor-pointer hover:bg-amber-500 transition duration-300 shadow-md">
//                   Login
//                 </button>
//               </Link>
//             ) : (
//               <div className="relative" ref={dropdownRef}>
//                 <div
//                   className="flex items-center gap-2 cursor-pointer"
//                   onClick={() => setShowDropdown(!showDropdown)}
//                 >
//                   {user.profile_image ? (
//                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-amber-400">
//                       <img
//                         src={user.profile_image}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           console.log("Image failed to load");
//                           e.target.style.display = "none";
//                           const parent = e.target.parentElement;
//                           const fallback = document.createElement("div");
//                           fallback.className =
//                             "w-full h-full flex items-center justify-center bg-gray-700";
//                           fallback.innerHTML = `<span class="text-xs font-semibold text-amber-400">${user.name?.charAt(0) || "U"}</span>`;
//                           parent.appendChild(fallback);
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <FaUserCircle
//                       size={30}
//                       className="text-amber-400 hover:text-amber-500 transition"
//                     />
//                   )}
//                   <span className="hidden md:inline text-gray-300 text-sm hover:text-amber-400 transition">
//                     Profile
//                   </span>
//                 </div>
//                 {showDropdown && (
//                   <div className="absolute right-0 mt-4 w-48 bg-black border border-amber-400/30 rounded-lg shadow-lg p-4 text-sm z-50">
//                     <div className="mb-3">
//                       <p className="font-semibold text-amber-400">
//                         {user.name || "User"}
//                       </p>
//                       <p className="text-gray-400 truncate text-xs">
//                         {user.email || "No Email"}
//                       </p>
//                     </div>
//                     <div className="space-y-2">
//                       <Link
//                         href="/profile"
//                         className="block text-gray-300 hover:text-amber-400 hover:bg-gray-900 py-2 px-3 rounded transition"
//                         onClick={() => setShowDropdown(false)}
//                       >
//                         My Profile
//                       </Link>
//                       <Link
//                         href="/orders"
//                         className="block text-gray-300 hover:text-amber-400 hover:bg-gray-900 py-2 px-3 rounded transition"
//                         onClick={() => setShowDropdown(false)}
//                       >
//                         My Orders
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full bg-amber-400 text-black font-semibold py-2 px-3 rounded hover:bg-amber-500 transition mt-2"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden text-3xl text-amber-400 hover:text-amber-500 transition"
//           >
//             {menuOpen ? "✕" : "☰"}
//           </button>
//         </div>

//         {/* Mobile Menu -*/}
//         {menuOpen && (
//           <ul className="md:hidden bg-black border-t border-amber-400/20 overflow-hidden transition-all duration-300 rounded-b-lg shadow-lg py-4">
//             <li>
//               <Link
//                 href="/"
//                 onClick={() => setMenuOpen(false)}
//                 className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/products"
//                 onClick={() => setMenuOpen(false)}
//                 className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//               >
//                 Products
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/about"
//                 onClick={() => setMenuOpen(false)}
//                 className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//               >
//                 About
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/contact"
//                 onClick={() => setMenuOpen(false)}
//                 className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//               >
//                 Contact
//               </Link>
//             </li>

//             {isLoggedIn && (
//               <>
//                 <li>
//                   <Link
//                     href="/profile"
//                     onClick={() => setMenuOpen(false)}
//                     className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//                   >
//                     My Profile
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     href="/orders"
//                     onClick={() => setMenuOpen(false)}
//                     className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
//                   >
//                     My Orders
//                   </Link>
//                 </li>
//               </>
//             )}
//             <li>
//               <div className="flex items-center justify-between gap-4 px-5 py-2">
//                 {/* Cart */}
//                 <Link href="/cart" onClick={() => setMenuOpen(false)}>
//                   <div className="relative flex items-center justify-center w-10 h-10">
//                     <FaShoppingCart className="text-amber-400 text-xl" />
//                     {cartCount > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                         {cartCount > 99 ? "99+" : cartCount}
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Button */}
//                 {!isLoggedIn ? (
//                   <Link
//                     href="/login"
//                     onClick={() => setMenuOpen(false)}
//                     className="flex-1"
//                   >
//                     <button className="w-full rounded-full bg-amber-400 py-2 text-black font-semibold transition hover:bg-amber-500">
//                       Login
//                     </button>
//                   </Link>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMenuOpen(false);
//                     }}
//                     className="flex-1 rounded-full bg-red-500 py-2 text-white font-semibold transition hover:bg-red-600"
//                   >
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </li>
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// }



"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import Image from "next/image";
import BASE_URL from "../../src/config/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", profile_image: "" });

  // Function to load cart count from localStorage
  const loadCartCount = () => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0,
      );
      setCartCount(totalItems);
    }
  };

  // Check if cart has items
  const hasCartItems = () => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.length > 0;
    }
    return false;
  };

  // Handle Buy button click - Direct checkout without login check
  const handleBuyClick = async (e) => {
    e.preventDefault();
    
    // Check if cart has items
    if (!hasCartItems()) {
      Swal.fire({
        title: "Empty Cart!",
        text: "Please add items to your cart before proceeding to checkout.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Browse Products",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/products");
        }
      });
      return;
    }

    // Direct to checkout without checking login
    // Set guest checkout flag
    localStorage.setItem("guestCheckout", "true");
    router.push("/checkout");
  };

  // Fetch user info from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
        }
      }

      const token = localStorage.getItem("token");
      if (token) {
        fetchUserProfile();
      }
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const userData = {
            name: data.data.name || "",
            email: data.data.email || "",
            profile_image: data.data.profile_image || data.data.image || "",
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    checkLoginStatus();
    loadCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Listen for storage changes
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") {
        loadCartCount();
      }
    });

    // Click outside to hide dropdown
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Login status check function
  const checkLoginStatus = () => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {
            console.error("Error parsing user:", err);
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleProfileUpdate = () => {
      checkLoginStatus();
      fetchUserProfile();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, []);

  // Update login status when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Check login status periodically
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      // Clear localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Clear guest checkout flag if exists
      localStorage.removeItem("guestCheckout");
      // Don't clear cart on logout - keep cart items

      // Update state
      setIsLoggedIn(false);
      setShowDropdown(false);
      loadCartCount();

      // Trigger storage event
      window.dispatchEvent(new Event("storage"));

      // Navigate to home
      router.push("/");

      // Success message
      Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (!hasMounted) return null;

  return (
    <nav className="w-full bg-black shadow-md border-b border-amber-400/20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo1.png"
              alt="Health & Beauty"
              width={60}
              height={20}
              className="rounded-full border-amber-400"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-1 justify-center items-center gap-8 text-md font-medium">
            <Link
              href="/"
              className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-amber-400 hover:bg-transparent px-3 py-1 rounded transition duration-300"
            >
              Contact
            </Link>
          </ul>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cart">
              <div className="relative">
                <FaShoppingCart className="text-amber-400 text-xl hover:text-amber-500 transition cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
            </Link>
            
            {/* Buy Button - Direct checkout without login */}
            <button
              onClick={handleBuyClick}
              type="button"
              className="relative rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black cursor-pointer hover:bg-amber-500 transition duration-300 shadow-md flex items-center justify-center"
            >
              Buy
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {!isLoggedIn ? (
              <Link href="/login">
                <button className="rounded-full bg-amber-400 px-5 py-2 text-sm text-black font-semibold cursor-pointer hover:bg-amber-500 transition duration-300 shadow-md">
                  Login
                </button>
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user.profile_image ? (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-amber-400">
                      <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Image failed to load");
                          e.target.style.display = "none";
                          const parent = e.target.parentElement;
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-full h-full flex items-center justify-center bg-gray-700";
                          fallback.innerHTML = `<span class="text-xs font-semibold text-amber-400">${user.name?.charAt(0) || "U"}</span>`;
                          parent.appendChild(fallback);
                        }}
                      />
                    </div>
                  ) : (
                    <FaUserCircle
                      size={30}
                      className="text-amber-400 hover:text-amber-500 transition"
                    />
                  )}
                  <span className="hidden md:inline text-gray-300 text-sm hover:text-amber-400 transition">
                    Profile
                  </span>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-48 bg-black border border-amber-400/30 rounded-lg shadow-lg p-4 text-sm z-50">
                    <div className="mb-3">
                      <p className="font-semibold text-amber-400">
                        {user.name || "User"}
                      </p>
                      <p className="text-gray-400 truncate text-xs">
                        {user.email || "No Email"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block text-gray-300 hover:text-amber-400 hover:bg-gray-900 py-2 px-3 rounded transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block text-gray-300 hover:text-amber-400 hover:bg-gray-900 py-2 px-3 rounded transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-amber-400 text-black font-semibold py-2 px-3 rounded hover:bg-amber-500 transition mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-amber-400 hover:text-amber-500 transition"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden bg-black border-t border-amber-400/20 overflow-hidden transition-all duration-300 rounded-b-lg shadow-lg py-4">
            <li>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
              >
                Contact
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
                  >
                    My Profile
                  </Link>
                </li>

                <li>
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-2 rounded text-gray-300 transition hover:text-amber-400 hover:bg-gray-900"
                  >
                    My Orders
                  </Link>
                </li>
              </>
            )}
            <li>
              <div className="flex items-center justify-between gap-4 px-5 py-2">
                {/* Cart */}
                <Link href="/cart" onClick={() => setMenuOpen(false)}>
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <FaShoppingCart className="text-amber-400 text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Buy Button for Mobile - Direct checkout without login */}
                <button
                  onClick={() => {
                    handleBuyClick();
                    setMenuOpen(false);
                  }}
                  className="flex-1 rounded-full bg-amber-400 py-2 text-black font-semibold transition hover:bg-amber-500"
                >
                  Buy Now
                </button>

                {/* Login/Logout Button */}
                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1"
                  >
                    <button className="w-full rounded-full bg-amber-400 py-2 text-black font-semibold transition hover:bg-amber-500">
                      Login
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex-1 rounded-full bg-red-500 py-2 text-white font-semibold transition hover:bg-red-600"
                  >
                    Logout
                  </button>
                )}
              </div>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}