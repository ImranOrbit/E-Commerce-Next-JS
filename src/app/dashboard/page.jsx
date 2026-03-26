"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Products from "../products/page";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkLogin = () => {
      const status = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(status);
      if (!status) {
        router.push("/"); // redirect immediately if logged out
      }
    };

    checkLogin(); // initial check

    // Listen to localStorage changes from logout
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, [router]);

  if (!isLoggedIn) return null; // prevent flashing dashboard

  return (
    <div>
      <Products />
    </div>
  );
}
