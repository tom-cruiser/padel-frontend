"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function BarreNavigation() {
  const [estDefilé, setEstDefilé] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const gererDefilement = () => {
      setEstDefilé(window.scrollY > 10);
    };

    window.addEventListener("scroll", gererDefilement);
    return () => window.removeEventListener("scroll", gererDefilement);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        estDefilé ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-white text-xl font-bold">
              Padel Club de Bujumbura
            </span>
          </Link>

          {/* Liens de Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              À Propos
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
              Connexion
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Basculer le menu"
            >
              {menuOuvert ? (
                // Icône X pour fermer
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Icône hamburger pour ouvrir
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
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOuvert && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/about"
                onClick={() => setMenuOuvert(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                À Propos
              </Link>
              <Link
                href="/services"
                onClick={() => setMenuOuvert(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Services
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOuvert(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Contact
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOuvert(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
