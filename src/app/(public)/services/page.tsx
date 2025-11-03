import Image from "next/image";
import Link from "next/link";

export default function Services() {
  return (
    <div className="space-y-20 py-10">
      {/* Services Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Nos Services</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Nous offrons une gamme complète de services de padel et de gestion
              sportive conçus pour répondre aux besoins des particuliers, des
              groupes et des entreprises. Des réservations de courts à
              l'entraînement professionnel, nous avons tout ce dont vous avez
              besoin pour profiter de ce sport passionnant.
            </p>
          </div>
          <div className="relative h-[500px]">
            <Image
              src="/images/white.jpeg"
              alt="Nos Services"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Ce Que Nous Offrons</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Réservations de Courts
              </h3>
              <p className="text-gray-600 mb-4">
                Réservez nos courts à la pointe de la technologie de 5h à 22h
                tous les jours. Disponibles pour des jeux occasionnels, des
                tournois et des événements.
              </p>
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Réserver Maintenant →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Coaching Professionnel
              </h3>
              <p className="text-gray-600 mb-4">
                Séances de coaching individuelles et en groupe avec des
                instructeurs expérimentés pour tous les niveaux de compétence.
              </p>
              <Link
                href="/contact"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                En Savoir Plus →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Vente d'Équipement</h3>
              <p className="text-gray-600 mb-4">
                Équipement de padel et de tennis Babolat de première qualité
                disponible à la vente et à la location.
              </p>
              <Link
                href="/contact"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Voir l'Équipement →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12">Services Supplémentaires</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Construction de Courts
            </h3>
            <p className="text-gray-600">
              Services professionnels de construction de courts de padel avec
              des spécifications modernes et des matériaux de qualité.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Événements d'Entreprise
            </h3>
            <p className="text-gray-600">
              Organisez des événements de team building, des tournois et des
              activités sportives d'entreprise.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Programmes Scolaires</h3>
            <p className="text-gray-600">
              Programmes spécialisés pour les écoles afin d'initier les élèves
              au padel et de promouvoir l'activité physique.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Gestion d'Événements</h3>
            <p className="text-gray-600">
              Gestion complète d'événements sportifs pour des tournois,
              compétitions et événements sociaux.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez Notre Communauté
          </h2>
          <p className="text-xl mb-8">
            Devenez membre et profitez d'avantages exclusifs, de réservations
            prioritaires et de tarifs spéciaux.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contactez-nous pour l'Adhésion
          </Link>
        </div>
      </section>
    </div>
  );
}
