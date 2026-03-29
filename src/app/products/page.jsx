// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import BASE_URL from "../../config/api";
// import Swal from "sweetalert2";

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState(["All"]);
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [showAll, setShowAll] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // FETCH PRODUCTS FROM LARAVEL API
//   useEffect(() => {
//     fetch(`${BASE_URL}/products`)
//       .then((res) => res.json())
//       .then((data) => {
//         const productsWithFinalPrice = data.map((p) => {
//           let finalPrice = parseFloat(p.original_price);

//           // OFFER CALCULATION
//           let hasOffer = false;
//           if (
//             p.offer &&
//             p.offer.is_active &&
//             new Date() >= new Date(p.offer.start_date) &&
//             new Date() <= new Date(p.offer.end_date)
//           ) {
//             hasOffer = true;
//             if (p.offer.type === "percentage") {
//               finalPrice -= (finalPrice * p.offer.value) / 100;
//             } else if (p.offer.type === "fixed") {
//               finalPrice -= p.offer.value;
//             }
//           }

//           return { ...p, final_price: finalPrice.toFixed(2), hasOffer };
//         });

//         setProducts(productsWithFinalPrice);

//         // DYNAMIC CATEGORIES FROM PRODUCTS
//         const uniqueCategories = [
//           "All",
//           ...new Set(data.map((item) => item.category)),
//         ];
//         setCategories(uniqueCategories);

//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//         setLoading(false);
//       });
//   }, []);

//   const filteredProducts = products.filter(
//     (p) =>
//       (activeCategory === "All" || p.category === activeCategory) &&
//       p.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const visibleProducts = showAll
//     ? filteredProducts
//     : filteredProducts.slice(0, 12);

//   const addToCart = (product) => {
//     const token = localStorage.getItem("token");

//     // Check if user is logged in
//     if (!token) {
//       Swal.fire({
//         title: "Login Required",
//         text: "Please login to add items to your cart",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Login Now",
//         cancelButtonText: "Cancel",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           router.push("/login");
//         }
//       });
//       return;
//     }

//     // Get existing cart from localStorage
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     // Check if product already exists in cart
//     const existingProductIndex = cart.findIndex(
//       (item) => item.product_id === product.id,
//     );

//     if (existingProductIndex !== -1) {
//       // Update quantity if product already exists
//       cart[existingProductIndex].quantity += 1;
//       Swal.fire({
//         title: "Cart Updated!",
//         text: `${product.name} quantity increased to ${cart[existingProductIndex].quantity}`,
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } else {
//       // Add new product to cart
//       const cartItem = {
//         product_id: product.id,
//         name: product.name,
//         price: parseFloat(product.final_price || product.original_price),
//         original_price: parseFloat(product.original_price),
//         quantity: 1,
//         image: product.image,
//         hasOffer: product.hasOffer,
//       };
//       cart.push(cartItem);

//       Swal.fire({
//         title: "Added to Cart!",
//         text: `${product.name} has been added to your cart.`,
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     }

//     // Save updated cart to localStorage
//     localStorage.setItem("cart", JSON.stringify(cart));

//     // Dispatch event to update navbar cart count
//     window.dispatchEvent(new Event("cartUpdated"));
//   };

//   const goToDetails = (id) => {
//     router.push(`/products/${id}`);
//   };

//   return (
//     <section className="bg-slate-50 px-4 py-10">
//       <div className="max-w-7xl mx-auto">
//         {/* SEARCH BAR */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search products by name..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setShowAll(false);
//             }}
//             className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
//           />
//         </div>

//         {/* MOBILE CATEGORIES */}
//         <div className="flex md:hidden gap-3 overflow-x-auto pb-4 mb-6">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setShowAll(false);
//               }}
//               className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
//                 activeCategory === cat
//                   ? "bg-blue-950 text-white"
//                   : "bg-white text-slate-800 border"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-col md:flex-row gap-8 mb-20">
//           {/* DESKTOP CATEGORIES */}
//           <aside className="hidden md:block md:w-1/4">
//             <h2 className="mb-4 text-lg font-bold text-slate-800">
//               Categories
//             </h2>
//             <ul className="space-y-3">
//               {categories.map((cat) => (
//                 <li
//                   key={cat}
//                   onClick={() => {
//                     setActiveCategory(cat);
//                     setShowAll(false);
//                   }}
//                   className={`cursor-pointer rounded-lg px-4 py-3 font-medium transition ${
//                     activeCategory === cat
//                       ? "bg-blue-950 text-white"
//                       : "bg-white text-slate-800 hover:bg-slate-100"
//                   }`}
//                 >
//                   {cat}
//                 </li>
//               ))}
//             </ul>
//           </aside>

//           {/* PRODUCTS */}
//           <div className="md:w-3/4">
//             {loading ? (
//               <p className="text-center font-semibold">Loading...</p>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {visibleProducts.length > 0 ? (
//                   visibleProducts.map((product) => (
//                     // <div
//                     //   key={product.id}
//                     //   className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition group"
//                     // >
//                     <div
//                       key={product.id}
//                       className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition group cursor-pointer"
//                       onClick={() => goToDetails(product.id)}
//                     >
//                       <div className="relative overflow-hidden rounded-t-2xl">
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
//                         />
//                         {product.hasOffer && (
//                           <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                             SALE
//                           </span>
//                         )}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px]">
//                           {product.name}
//                         </h3>

//                         {/* PRICE WITH OFFER */}

//                         <div className="mt-2 text-slate-800 font-bold">
//                           {product.hasOffer ? (
//                             <div className="flex items-center gap-2">
//                               <span className="line-through text-slate-400 text-sm">
//                                 £{parseFloat(product.original_price).toFixed(2)}
//                               </span>
//                               <span className="text-red-600 text-lg">
//                                 £{parseFloat(product.final_price).toFixed(2)}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-lg">
//                               £{parseFloat(product.original_price).toFixed(2)}
//                             </span>
//                           )}
//                         </div>

                       

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             addToCart(product);
//                           }}
//                           className="mt-4 w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition duration-300 transform hover:scale-105"
//                         >
//                           Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="col-span-full text-center text-black font-medium py-10">
//                     No products found
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* VIEW ALL */}
//             {filteredProducts.length > 12 && !showAll && (
//               <div className="mt-8 mb-20 md:mb-10 text-center">
//                 <button
//                   onClick={() => setShowAll(true)}
//                   className="text-blue-950 font-semibold hover:underline cursor-pointer text-lg"
//                 >
//                   View All Products ({filteredProducts.length}) →
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BASE_URL from "../../config/api";
import Swal from "sweetalert2";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FETCH PRODUCTS FROM LARAVEL API
  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const productsWithFinalPrice = data.map((p) => {
          let finalPrice = parseFloat(p.original_price);

          // OFFER CALCULATION
          let hasOffer = false;
          if (
            p.offer &&
            p.offer.is_active &&
            new Date() >= new Date(p.offer.start_date) &&
            new Date() <= new Date(p.offer.end_date)
          ) {
            hasOffer = true;
            if (p.offer.type === "percentage") {
              finalPrice -= (finalPrice * p.offer.value) / 100;
            } else if (p.offer.type === "fixed") {
              finalPrice -= p.offer.value;
            }
          }

          return { ...p, final_price: finalPrice.toFixed(2), hasOffer };
        });

        setProducts(productsWithFinalPrice);

        // DYNAMIC CATEGORIES FROM PRODUCTS
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 12);

  const addToCart = (product) => {
    const token = localStorage.getItem("token");

    // If user is already logged in, add to cart directly
    if (token) {
      addToCartDirectly(product);
      return;
    }

    // Show option for registration/login or guest checkout
    Swal.fire({
      title: 'Choose Order Method',
      text: 'How would you like to proceed?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Login/Register',
      denyButtonText: 'Continue as Guest',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6c757d',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // User wants to login/register
        router.push('/login');
      } else if (result.isDenied) {
        // User wants to continue as guest
        addToCartDirectly(product);
        Swal.fire({
          title: 'Guest Cart',
          text: 'Your items have been added to cart. Please note you need to register/login at checkout.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: true,
          confirmButtonText: 'OK'
        });
      }
      // If cancelled, do nothing
    });
  };

  const addToCartDirectly = (product) => {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
      (item) => item.product_id === product.id,
    );

    if (existingProductIndex !== -1) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += 1;
      Swal.fire({
        title: "Cart Updated!",
        text: `${product.name} quantity increased to ${cart[existingProductIndex].quantity}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Add new product to cart
      const cartItem = {
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.final_price || product.original_price),
        original_price: parseFloat(product.original_price),
        quantity: 1,
        image: product.image,
        hasOffer: product.hasOffer,
      };
      cart.push(cartItem);

      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
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

  const goToDetails = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowAll(false);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* MOBILE CATEGORIES */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowAll(false);
              }}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-blue-950 text-white"
                  : "bg-white text-slate-800 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-20">
          {/* DESKTOP CATEGORIES */}
          <aside className="hidden md:block md:w-1/4">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Categories
            </h2>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowAll(false);
                  }}
                  className={`cursor-pointer rounded-lg px-4 py-3 font-medium transition ${
                    activeCategory === cat
                      ? "bg-blue-950 text-white"
                      : "bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* PRODUCTS */}
          <div className="md:w-3/4">
            {loading ? (
              <p className="text-center font-semibold">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl bg-white shadow-sm hover:shadow-lg transition group cursor-pointer"
                      onClick={() => goToDetails(product.id)}
                    >
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {product.hasOffer && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SALE
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>

                        {/* PRICE WITH OFFER */}
                        <div className="mt-2 text-slate-800 font-bold">
                          {product.hasOffer ? (
                            <div className="flex items-center gap-2">
                              <span className="line-through text-slate-400 text-sm">
                                £{parseFloat(product.original_price).toFixed(2)}
                              </span>
                              <span className="text-red-600 text-lg">
                                £{parseFloat(product.final_price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg">
                              £{parseFloat(product.original_price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="mt-4 w-full rounded-full bg-blue-950 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition duration-300 transform hover:scale-105"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-black font-medium py-10">
                    No products found
                  </p>
                )}
              </div>
            )}

            {/* VIEW ALL */}
            {filteredProducts.length > 12 && !showAll && (
              <div className="mt-8 mb-20 md:mb-10 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-blue-950 font-semibold hover:underline cursor-pointer text-lg"
                >
                  View All Products ({filteredProducts.length}) →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}