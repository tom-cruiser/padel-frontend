"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen bg-black">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            <source src="/videos/padel-tennis-match.mov" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Experience the Future
              <br />
              of Racket Sports
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              Join the fastest growing sport in the world at Burundi's premier
              Padel facility
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white bg-white text-gray-900 text-lg font-semibold rounded-full hover:bg-transparent hover:text-white transition-colors duration-300"
              >
                Book a Court
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                24/7
              </div>
              <div className="text-gray-400">Access</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                4+
              </div>
              <div className="text-gray-400">Pro Courts</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                1st
              </div>
              <div className="text-gray-400">In East Africa</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-green-500">
                500+
              </div>
              <div className="text-gray-400">Active Players</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Padel?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Easy to Learn",
                description:
                  "Perfect for beginners, learn the basics in just one session",
                icon: "🎯",
              },
              {
                title: "Social Sport",
                description:
                  "Always played in doubles, making it the ultimate social game",
                icon: "🤝",
              },
              {
                title: "All Ages Welcome",
                description: "Suitable for everyone from kids to seniors",
                icon: "👨‍👩‍👧‍👦",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Court Booking Preview */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                State-of-the-Art Facilities
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our courts feature the latest technology and premium materials
                for the ultimate playing experience. Book your court instantly
                through our online system.
              </p>
              <div className="space-y-4">
                {[
                  "Professional-grade artificial turf",
                  "LED lighting for night games",
                  "Digital scoring system",
                  "Instant online booking",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/court-preview.jpg"
                alt="Padel Court"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Check Court Availability
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Messaging Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-6">
            Stay Connected with Players
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Connect with other players instantly through our real-time messaging
            system. Send messages anytime - they'll receive them when they're
            online!
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Player</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-600">
                  Would you like to play doubles tomorrow at 6 PM?
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                    AS
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Alice Smith</p>
                    <p className="text-sm text-gray-500">Coach</p>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <p className="text-gray-600">
                  Your lesson has been confirmed for next week!
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 text-primary-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Real-time Chat</p>
                    <p className="text-gray-600">
                      Instant messaging with online players
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 text-primary-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Offline Messages</p>
                    <p className="text-gray-600">
                      Messages are saved and delivered when players come online
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 text-primary-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Easy to Use</p>
                    <p className="text-gray-600">
                      Simple interface for quick communication
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Players Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "The facilities are world-class and the community is amazing. I'm addicted!",
                name: "Sarah M.",
                role: "Regular Player",
              },
              {
                text: "As a beginner, I found it incredibly easy to learn and the coaches are excellent.",
                name: "John D.",
                role: "New Player",
              },
              {
                text: "Best sports facility in Bujumbura. The online booking system is very convenient.",
                name: "Marie K.",
                role: "Club Member",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="text-gray-600 mb-6">{testimonial.text}</div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/pattern-bg.jpg"
            alt="Background Pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Experience the excitement of Padel at Burundi's premier sports
            facility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-green-600 transition-colors"
            >
              Contact Nous
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
