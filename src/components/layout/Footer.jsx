import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Sobre Nosotros
            </h3>
            <p className="text-base-content/70 text-sm">
              Tu fuente confiable para juegos y DLCs de Switch. Ofrecemos
              cuentas auténticas con compras verificadas.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Accesos Rápidos
            </h3>
            <div className="space-y-2">
              <Link 
                to="/games" 
                className="link link-hover block text-base-content/70 hover:text-base-content transition-colors"
              >
                Games
              </Link>
              <Link 
                to="/game-packs" 
                className="link link-hover block text-base-content/70 hover:text-base-content transition-colors"
              >
                Game Packs
              </Link>
              {/* <Link 
                to="/dlcs" 
                className="link link-hover block text-base-content/70 hover:text-base-content transition-colors"
              >
                DLCs
              </Link> */}
              <Link 
                to="/faq" 
                className="link link-hover block text-base-content/70 hover:text-base-content transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
          
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Contacto
            </h3>
            <div className="space-y-2">
              <p className="text-base-content/70 text-sm">
                Email: support@dekugames.com
              </p>
              <p className="text-base-content/70 text-sm">
                Discord: DekuGames
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-base-content/20">
          <p className="text-center text-base-content/50 text-sm">
            © {new Date().getFullYear()} DekuGames Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 