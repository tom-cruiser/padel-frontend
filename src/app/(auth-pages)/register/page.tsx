"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    language: "en",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un Compte
            </h1>
            <p className="text-gray-600">Rejoignez notre communauté de Padel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="label">
                  Nom de famille
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            {/* <div>
              <label htmlFor="language" className="label">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="input"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création du compte..." : "Créer un compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Connectez-vous ici
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
