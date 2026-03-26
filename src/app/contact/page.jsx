
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";

export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "We will contact you soon 😊",
          confirmButtonColor: "#f59e0b",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong!",
          confirmButtonColor: "#f59e0b",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later!",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-400">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 mb-4"></div>
          <p className="mt-3 text-gray-300">
            We're here to help you with orders, support & inquiries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Info */}
          <div className="bg-gray-900 rounded-xl p-6 border border-amber-400/20">
            <h3 className="text-xl font-semibold mb-4 text-amber-400">
              Customer Support
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl">📧</span>
                <p className="text-gray-300">
                  support@orbitmediasolution.com
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl">📞</span>
                <p className="text-gray-300">
                  +880 1234-567890
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl">🕒</span>
                <p className="text-gray-300">
                  24/7 Support Available
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-amber-400/20">
              <h4 className="text-amber-400 font-semibold mb-2">Visit Us</h4>
              <p className="text-gray-400 text-sm">
                123 Fashion Street, Dhaka<br />
                Bangladesh
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 rounded-xl p-6 shadow space-y-4 border border-amber-400/20"
          >
            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-2 text-gray-300 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-2 text-gray-300 focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-400 text-sm font-medium mb-2">
                Your Message
              </label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full rounded-lg border border-gray-700 bg-black px-4 py-2 text-gray-300 focus:outline-none focus:border-amber-400 transition"
                required
              ></textarea>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-full bg-amber-400 py-3 text-black font-semibold hover:bg-amber-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </form>

        </div>

        {/* Map Section Optional */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            ✨ We respond to all messages within 24 hours ✨
          </p>
        </div>
      </div>
    </section>
  );
}