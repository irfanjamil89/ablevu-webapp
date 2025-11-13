"use client";
import React, { useEffect, useState } from 'react';



export default function Header1() {

const [user, setUser] = useState<any | null>(null); // Initial state is null for user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    console.log('Token from localStorage:', token); // Log the token value

    if (!token) {
      console.error('No token found, please log in.');
      setError('Please log in to continue.');
      setLoading(false);
      return;
    }

    // Fetch user data using the token for authentication
    fetch('http://51.75.68.69:3006/users?id=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Make sure the token is being included in the header
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        if (data && data.length > 0) {
          setUser(data[0]); // Set user data if fetched successfully
        } else {
          setError('User not found.');
        }
        setLoading(false); // Set loading to false after fetch is done
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount




  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/"; // redirect after logout
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while the data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if something goes wrong
  }

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 lg:px-6 py-1">
        {/* Left side: Logo + Welcome message */}
        <div className="flex items-center gap-[85px]">
          {/* Logo */}
          <a href="/dashboard" className="w-[180px]">
            <img
              src="/assets/images/logo.png"
              alt="AbleVu Logo"
              className="w-[180px]"
            />
          </a>

          {/* Welcome Message */}
          <div className="flex items-center gap-5 text-gray-700">
            <span className="text-2xl">👋</span>
            <span className="font-medium text-xl">
              Welcome Back! <span>{user.first_name} {user.last_name}</span>
            </span>
          </div>
        </div>

        {/* Right side: Logout button */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition"
            onClick={handleLogout}>
            {/* Logout Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-10V5a2 2 0 10-4 0v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
