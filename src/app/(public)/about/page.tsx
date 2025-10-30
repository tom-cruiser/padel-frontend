import Image from "next/image";

export default function About() {
  return (
    <div className="space-y-20 py-10">
      {/* Introduction Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">About Padel</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Padel is the fastest growing sport in the world, combining the
              best elements of tennis, squash, and badminton. It is played on an
              enclosed court, featuring walls that are actively used in the
              game, making for dynamic and engaging rallies.
            </p>
            <p className="text-lg text-gray-600">
              Padel is extremely fun, social, and accessible to everyone from 5
              to 109 years old. The sport's unique characteristics make it
              perfect for both beginners and experienced players.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/photo1.jpg"
              alt="Padel Game in Action"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Court Specifications */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">The Padel Court</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative h-[400px]">
              <Image
                src="/images/photo2.jpg"
                alt="Padel Court Specifications"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                A Padel court measures 10 meters wide and 20 meters long,
                divided by a net. The court is surrounded by walls of 3 to 4
                meters in height that are actively used during play, adding an
                exciting dimension to the game.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Dimensions</h3>
                  <p className="text-gray-600">10m x 20m</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Wall Height</h3>
                  <p className="text-gray-600">3-4 meters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12">Equipment Guide</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Round Racket</h3>
            <p className="text-gray-600 mb-4">
              Focused on control and maneuverability, perfect for beginners.
            </p>
            <div className="text-sm text-gray-500">Balance Focus: Low</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Tear Drop Racket</h3>
            <p className="text-gray-600 mb-4">
              Balanced between power and control, great for intermediate
              players.
            </p>
            <div className="text-sm text-gray-500">Balance Focus: Medium</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Diamond Racket</h3>
            <p className="text-gray-600 mb-4">
              Maximum power for advanced players.
            </p>
            <div className="text-sm text-gray-500">Balance Focus: High</div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Leadership & Vision</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                The Padel movement in Burundi is spearheaded by Burundian and
                Swedish Padel Coach, Jean-Marie Julien Nsengiyumva, a former
                Tennis professional.
              </p>
              <p className="text-lg text-gray-600">
                Jean-Marie Julien also serves as the President of the African
                Padel Zone 4, connecting 11 countries in the region: Burundi,
                Rwanda, Tanzania, Kenya, Uganda, Soudan, South-Soudan, Ethiopia,
                Eritrea, Somalia, and Djibouti.
              </p>
              <p className="text-lg text-gray-600">
                The club is actively involved in supporting the Burundi Padel
                National Team and promoting the sport throughout the region.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/photo1.jpg"
                alt="Jean-Marie Julien Nsengiyumva"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
