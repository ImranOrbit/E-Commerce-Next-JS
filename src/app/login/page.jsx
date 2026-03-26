"use client";

import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password",
      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data)

      if (res.ok && data.status) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${data.user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        router.push("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#f5f5f5] p-10 rounded-xl shadow-md w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded border border-slate-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded border border-slate-300 px-4 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-950 px-5 py-2 text-white font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-center text-sm">
          <a href="/signup" className="text-blue-950 hover:underline font-medium transition">
            Sign Up
          </a>
          <a href="/forgot-password" className="text-blue-950 hover:underline font-medium transition">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}



