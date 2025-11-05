import Image from "next/image";

export default function About() {
  return (
    <div className="space-y-20 py-10">
      {/* Introduction Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          À Propos du Padel
        </h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              Le padel est le sport qui connaît la croissance la plus rapide au
              monde, combinant les meilleurs éléments du tennis, du squash et du
              badminton. Il se joue sur un court fermé, avec des murs qui sont
              activement utilisés dans le jeu, rendant les échanges dynamiques
              et engageants.
            </p>
            <p className="text-lg text-gray-700">
              Le padel est extrêmement amusant, social et accessible à tous, des
              5 aux 109 ans. Les caractéristiques uniques de ce sport en font un
              choix parfait tant pour les débutants que pour les joueurs
              expérimentés.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/padel-6322450_1280.jpg"
              alt="Jeu de Padel en Action"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Court Specifications */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#DEDED1] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Le Court de Padel
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative h-[400px]">
              <Image
                src="/images/court2.jpeg"
                alt="Spécifications du Court de Padel"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                Un court de padel mesure 10 mètres de large et 20 mètres de
                long, divisé par un filet. Le court est entouré de murs de 3 à 4
                mètres de hauteur qui sont activement utilisés pendant le jeu,
                ajoutant une dimension excitante au jeu.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Dimensions
                  </h3>
                  <p className="text-gray-600">10m x 20m</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Hauteur des Murs
                  </h3>
                  <p className="text-gray-600">3-4 mètres</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#DEDED1] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
          Guide de l'Équipement
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Raquette Ronde</h3>
            <p className="text-gray-600 mb-4">
              Axée sur le contrôle et la maniabilité, parfaite pour les
              débutants.
            </p>
            <div className="text-sm text-gray-500">Équilibre : Faible</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Raquette en Forme de Goutte
            </h3>
            <p className="text-gray-600 mb-4">
              Équilibrée entre puissance et contrôle, idéale pour les joueurs
              intermédiaires.
            </p>
            <div className="text-sm text-gray-500">Équilibre : Moyen</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Raquette en Forme de Diamant
            </h3>
            <p className="text-gray-600 mb-4">
              Puissance maximale pour les joueurs avancés.
            </p>
            <div className="text-sm text-gray-500">Équilibre : Élevé</div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#DEDED1] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            Leadership & Vision
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                Le mouvement padel au Burundi est dirigé par le coach de padel
                burundais et suédois, Jean-Marie Julien Nsengiyumva, un ancien
                professionnel du tennis.
              </p>
              <p className="text-lg text-gray-700">
                Jean-Marie Julien est également président de la Zone 4 du Padel
                africain, reliant 11 pays de la région : Burundi, Rwanda,
                Tanzanie, Kenya, Ouganda, Soudan, Soudan du Sud, Éthiopie,
                Érythrée, Somalie et Djibouti.
              </p>
              <p className="text-lg text-gray-700">
                Le club est activement impliqué dans le soutien de l'équipe
                nationale de padel du Burundi et dans la promotion du sport dans
                toute la région.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/founder.jpeg"
                alt="Jean-Marie Julien Nsengiyumva"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
