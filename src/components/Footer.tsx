const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez Nous</h3>
            <div className="space-y-2">
              <p>Entente Sportive de Bujumbura</p>
              <p>Avenue Nicolas Mayugi N° 3</p>
              <p>Email: bujumburapadel@gmail.com</p>
              <p>Tel/WhatsApp: +257 76 322 521</p>
              <p>+257 69 729 399</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Heure d'Ouverture</h3>
            <div className="space-y-2">
              <p>Du Lundi au Dimanche</p>
              <p>5:00 AM to 10:00 PM</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez Nous</h3>
            <div className="space-y-2">
              <a href="#" className="block hover:text-green-400">
                Facebook
              </a>
              <a href="#" className="block hover:text-green-400">
                Instagram
              </a>
              <a href="#" className="block hover:text-green-400">
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()}Club de Padel de Bujumbura. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
