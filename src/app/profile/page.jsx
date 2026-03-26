"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import BASE_URL from "../../config/api";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user from API
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        Swal.fire({
          title: "Error!",
          text: "Please login first",
          icon: "error",
        });
        router.push("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile fetch response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data);
        
        if (data.success) {
          const userData = {
            name: data.data.name || "",
            email: data.data.email || "",
            phone: data.data.phone || "",
            address: data.data.address || "",
            image: data.data.profile_image || data.data.image || "",
          };
          
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } else {
        const errorText = await response.text();
        console.error("Fetch error:", errorText);
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Error!",
        text: "Image size should be less than 5MB",
        icon: "error",
      });
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      Swal.fire({
        title: "Error!",
        text: "Please select an image file",
        icon: "error",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        console.log("Uploading image, base64 length:", base64String.length);
        
        // Send to API
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: base64String,
          }),
        });

        console.log("Image upload response:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Image upload data:", data);
          
          if (data.success) {
            // Update local state with server response
            setUser((prev) => ({
              ...prev,
              image: data.data.profile_image || data.data.image || base64String,
            }));
            
            // Update localStorage
            const updatedUser = {
              ...user,
              image: data.data.profile_image || data.data.image || base64String,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            Swal.fire({
              title: "Success!",
              text: "Profile image updated successfully",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            
            // Refresh profile data
            fetchUserProfile();
          } else {
            Swal.fire({
              title: "Error!",
              text: data.message || "Failed to update image",
              icon: "error",
            });
          }
        } else {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          Swal.fire({
            title: "Error!",
            text: "Failed to upload image",
            icon: "error",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        title: "Error!",
        text: "Network error while uploading image",
        icon: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Save profile data (without image)
  const handleSave = async () => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        Swal.fire({
          title: "Error!",
          text: "Please login first",
          icon: "error",
        });
        router.push("/login");
        return;
      }

      // Create data object
      const dataToSend = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };

      console.log("Sending profile data:", dataToSend);

      const response = await fetch(`${BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Profile update response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Profile update data:", data);
        
        if (data.success) {
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify({
            ...user,
            ...data.data
          }));
          
          // Update state with fresh data
          setUser(prev => ({
            ...prev,
            ...data.data
          }));
          
          Swal.fire({
            title: "Success!",
            text: "Profile updated successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          
          // Refresh profile data
          fetchUserProfile();
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message || "Failed to update profile",
            icon: "error",
          });
        }
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        Swal.fire({
          title: "Error!",
          text: "Failed to update profile",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text: "Network error",
        icon: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image failed to load:", user.image);
    // Try alternative URL format
    if (user.image && user.image.includes('127.0.0.1')) {
      const altUrl = user.image.replace('127.0.0.1', 'localhost');
      e.target.src = altUrl;
    } else {
      // Show placeholder
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML = '<span class="text-black text-xl">?</span>';
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded text-black mb-20">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-5">My Profile</h1>
        <button
          onClick={() => router.back()}
          className="text-3xl text-black hover:text-black"
          aria-label="Go back"
        >
          <IoClose />
        </button>
      </div>

      <div className="flex flex-col items-center mb-5">
        <input
          type="file"
          accept="image/*"
          id="profileImageUpload"
          onChange={handleImageChange}
          className="hidden"
          disabled={isUpdating}
        />

        <label
          htmlFor="profileImageUpload"
          className={`cursor-pointer w-24 h-24 rounded-full overflow-hidden flex items-center justify-center border border-gray-300 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {user.image ? (
            // Next.js Image component with error handling
            <div className="relative w-full h-full">
              <Image
                src={user.image}
                alt="Profile Image"
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={true} // Important for localhost
                onError={handleImageError}
                priority={false}
              />
            </div>
          ) : (
            <span className="text-black text-xl">?</span>
          )}
        </label>

        <p className="text-sm text-gray-600 mt-2">
          {isUpdating ? "Uploading..." : "Click image to upload"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-black"
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Address
          </label>
          <textarea
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded text-black resize-none"
            placeholder="Enter your address"
            disabled={isUpdating}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className={`w-full py-2 px-4 rounded mt-4 ${
            isUpdating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-950 hover:bg-blue-800"
          } text-white`}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}



