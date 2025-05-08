import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              About Us
            </h3>
            <p className="text-base-content/70 text-sm">
              Your trusted source for Nintendo games and DLCs. We provide authentic
              accounts with verified purchases.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Quick Links
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
              <Link 
                to="/dlcs" 
                className="link link-hover block text-base-content/70 hover:text-base-content transition-colors"
              >
                DLCs
              </Link>
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
              Contact
            </h3>
            <div className="space-y-2">
              <p className="text-base-content/70 text-sm">
                Email: support@nintendostore.com
              </p>
              <p className="text-base-content/70 text-sm">
                Discord: NintendoStore
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-base-content/20">
          <p className="text-center text-base-content/50 text-sm">
            © {new Date().getFullYear()} Nintendo Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 