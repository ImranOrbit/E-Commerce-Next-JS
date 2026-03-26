


"use client";
import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";
import Swal from "sweetalert2";

export default function OrderDetails({ onClose }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
    loadUser();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  };

  const loadUser = () => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(savedUser);
  };

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum.toFixed(2));
  }, [cart]);

  // Update cart in localStorage and dispatch event
  const updateCartAndNotify = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // increase qty
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.product_id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartAndNotify(updated);
  };

  // decrease qty (min 1)
  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item.product_id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCartAndNotify(updated);
  };

  // remove item
  const removeItem = (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = cart.filter((item) => item.product_id !== id);
        updateCartAndNotify(updated);
        
        Swal.fire({
          title: "Removed!",
          text: "Item has been removed from cart.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Empty Cart",
        text: "Please add items to your cart before confirming order.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to place your order.",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Clear cart after successful order
        localStorage.removeItem("cart");
        setCart([]);
        // Dispatch event to update navbar cart count
        window.dispatchEvent(new Event("cartUpdated"));

        Swal.fire({
          icon: "success",
          title: "Order Confirmed! 🎉",
          text: "Your order has been placed successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        // Close the order panel after 2 seconds
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Order error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Failed to connect to server. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="h-full p-4 sm:p-6 text-black flex flex-col bg-white">
      {/* MOBILE CLOSE ICON */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-2xl font-bold text-red-500 hover:text-black sm:hidden"
        aria-label="Close order panel"
      >
        ×
      </button>
      
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-950">
        Order Details
      </h2>

      {/* USER INFO */}
      <div className="mb-4 text-sm space-y-1 p-3 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-700">
          <span className="text-blue-950">👤 Name:</span> {user.name || "Not set"}
        </p>
        <p className="font-medium text-gray-700">
          <span className="text-blue-950">📧 Email:</span> {user.email || "Not set"}
        </p>
        <p className="font-medium text-gray-700">
          <span className="text-blue-950">📞 Phone:</span> {user.phone || "Not set"}
        </p>
        <p className="font-medium text-gray-700">
          <span className="text-blue-950">📍 Address:</span> {user.address || "Not set"}
        </p>
      </div>

      {/* CART ITEMS */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {cart.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No items in cart</p>
            <button
              onClick={onClose}
              className="mt-4 text-blue-950 font-semibold hover:underline"
            >
              Continue Shopping →
            </button>
          </div>
        )}

        {cart.map((item) => (
          <div
            key={item.product_id}
            className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 p-2 rounded-lg transition"
          >
            {/* LEFT */}
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base text-gray-800">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${item.price.toFixed(2)} each
              </p>

              {/* QTY CONTROLLER */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.product_id)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-black text-lg font-bold flex items-center justify-center hover:bg-gray-200 transition"
                >
                  −
                </button>

                <span className="min-w-[36px] text-center bg-gray-100 text-black font-bold rounded py-1">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item.product_id)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-black text-lg font-bold flex items-center justify-center hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              <p className="font-bold text-sm sm:text-base text-blue-950">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.product_id)}
                className="text-red-500 text-xl font-bold hover:text-red-700 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      {cart.length > 0 && (
        <div className="mt-4 flex justify-between font-bold text-base sm:text-lg border-t pt-4">
          <span className="text-gray-700">Total</span>
          <span className="text-blue-950 text-xl">${total}</span>
        </div>
      )}

      {/* CONFIRM BUTTON */}
      <button
        onClick={confirmOrder}
        disabled={cart.length === 0}
        className="mt-4 w-full bg-blue-950 text-white py-3 rounded-full font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition mb-10"
      >
        {cart.length === 0 ? "Cart is Empty" : "Confirm Order"}
      </button>
    </div>
  );
}