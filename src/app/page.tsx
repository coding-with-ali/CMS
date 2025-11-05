"use client";

import Image from "next/image";
import React from "react";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: "url('/Master-Motors-Corp.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur + Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-4 md:py-5">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
            <Image
              src="/logo.png"
              alt="Master Motor Logo"
              width={130}
              height={60}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          {/* Company Name */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center text-white tracking-wide drop-shadow-md mt-3 md:mt-0">
            Master Motor Corp. Pvt. Ltd.
          </h1>

          {/* Placeholder for spacing */}
          <div className="hidden md:block w-[130px]" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-40 md:mt-32">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          Complaint Management System
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mb-10">
          Streamline and track all customer complaints efficiently with transparency.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a
            href="/complain-form"
            className="bg-white/90 text-black font-semibold py-4 px-10 rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 backdrop-blur-md"
          >
            Complaint Form
          </a>

          <a
            href="/dashboard"
            className="bg-white/90 text-black font-semibold py-4 px-10 rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 backdrop-blur-md"
          >
            Go To Dashboard
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center text-gray-300 text-xs sm:text-sm py-5 bg-black/30 backdrop-blur-sm border-t border-white/10">
        © {new Date().getFullYear()} Master Motor Corp. Pvt. Ltd. — All Rights Reserved
      </footer>
    </div>
  );
}
