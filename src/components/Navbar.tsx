"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-white text-xl font-bold">
              Padel Club de Bujumbura{" "}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
