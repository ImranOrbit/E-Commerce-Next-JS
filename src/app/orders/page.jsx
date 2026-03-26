
"use client";

import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";
import Link from "next/link";
import { FaShoppingBag, FaEye, FaArrowLeft, FaCalendar, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (!token) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      let ordersData = [];
      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data.data && Array.isArray(data.data)) {
        ordersData = data.data;
      } else if (data.orders && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else {
        ordersData = [];
      }

      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      
      // Show error message with SweetAlert
      if (err.message.includes("login") || err.message.includes("token")) {
        Swal.fire({
          title: "Authentication Required",
          text: "Please login to view your orders",
          icon: "warning",
          confirmButtonText: "Login Now",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  // Calculate current page orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewOrderDetails = (orderId) => {
    router.push(`/order-details/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {error.includes("login") ? "Login Required" : "No Orders Found"}
          </h2>
          <p className="text-gray-600 mb-8">
            {error.includes("login") 
              ? "Please login to view your order history"
              : "You haven't placed any orders yet. Start shopping now!"}
          </p>
          <Link href={error.includes("login") ? "/login" : "/products"}>
            <button className="bg-blue-950 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition duration-300">
              {error.includes("login") ? "Login Now" : "Start Shopping"}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-950 transition mb-4"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                My Orders
              </h1>
              {user && (
                <p className="text-gray-600 mt-1">
                  Welcome back, {user.name || "Customer"}!
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-blue-950">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start shopping to see your orders here!
            </p>
            <Link href="/products">
              <button className="bg-blue-950 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-800 transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-500">
                            Order #{order.id}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)} {order.status || "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaCalendar className="text-xs" />
                            <span>
                              {new Date(order.created_at || order.order_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCreditCard className="text-xs" />
                            <span className="capitalize">
                              {order.payment_method || "COD"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-950">
                          ${parseFloat(order.total || order.total_amount || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {item.product?.name || item.name || "Product"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">
                                ${(item.quantity * (item.price || 0)).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${parseFloat(item.price || 0).toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-blue-950 mt-2">
                            + {order.items.length - 3} more item(s)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No items found for this order
                      </p>
                    )}

                    {/* View Details Button */}
                    <div className="mt-4 pt-3 border-t flex justify-end">
                      <Link href={`/order-details/${order.id}`}>
                        <button className="flex items-center gap-2 text-blue-950 hover:text-blue-800 font-semibold transition">
                          <FaEye className="text-sm" />
                          View Order Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition ${
                          currentPage === pageNum
                            ? "bg-blue-950 text-white"
                            : "border hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}