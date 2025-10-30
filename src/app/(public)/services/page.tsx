import Image from "next/image";
import Link from "next/link";

export default function Services() {
  return (
    <div className="space-y-20 py-10">
      {/* Services Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              We offer a comprehensive range of Padel and sports management
              services designed to cater to individuals, groups, and businesses.
              From court bookings to professional coaching, we have everything
              you need to enjoy this exciting sport.
            </p>
          </div>
          <div className="relative h-[300px]">
            <Image
              src="/images/photo8.jpg"
              alt="Our Services"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Court Bookings</h3>
              <p className="text-gray-600 mb-4">
                Book our state-of-the-art courts from 5 AM to 10 PM daily.
                Available for casual games, tournaments, and events.
              </p>
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Book Now →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Professional Coaching
              </h3>
              <p className="text-gray-600 mb-4">
                Individual and group coaching sessions with experienced
                instructors for all skill levels.
              </p>
              <Link
                href="/contact"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Learn More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Equipment Sales</h3>
              <p className="text-gray-600 mb-4">
                Premium Babolat Padel & Tennis equipment available for purchase
                and rental.
              </p>
              <Link
                href="/contact"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View Equipment →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12">Additional Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Court Construction</h3>
            <p className="text-gray-600">
              Professional Padel court construction services with modern
              specifications and quality materials.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Corporate Events</h3>
            <p className="text-gray-600">
              Organize team building events, tournaments, and corporate sports
              activities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">School Programs</h3>
            <p className="text-gray-600">
              Specialized programs for schools to introduce students to Padel
              and promote physical activity.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Events Management</h3>
            <p className="text-gray-600">
              Full-service sports event management for tournaments,
              competitions, and social events.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8">
            Become a member and enjoy exclusive benefits, priority bookings, and
            special rates.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us for Membership
          </Link>
        </div>
      </section>
    </div>
  );
}
