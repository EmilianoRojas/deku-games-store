import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCard from '../components/common/AccountCard';
import SingleGameCard from '../components/common/SingleGameCard';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [singleGames, setSingleGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('nintendo_accounts')
        .select(`
          *,
          account_transactions (
            item_name,
            price,
            purchase_date,
            type,
            cover_image
          )
        `)

      if (error) throw error;

      // Filter accounts with more than one game, then sort by price
      const filteredAccounts = data
        .filter(account => {
          const games = account.account_transactions.filter(t => t.type === 'game');
          return games.length > 1; // Only check for multiple games, DLCs are allowed
        })
        .sort((a, b) => a.final_price - b.final_price)
        .slice(0, 10); // Get top 10 lowest priced accounts

      // Filter single games and sort by price
      const filteredSingleGames = data
        .filter(account => {
          const games = account.account_transactions.filter(t => t.type === 'game');
          return games.length === 1; // Only single games
        })
        .sort((a, b) => a.final_price - b.final_price)
        .slice(0, 10); // Get top 10 lowest priced single games

      setFeaturedAccounts(filteredAccounts);
      setSingleGames(filteredSingleGames);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-base-300 text-base-content mb-8 bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px]"
           style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-base-300 bg-opacity-70" />
        <div className="relative h-full flex flex-col justify-center px-4 md:px-6 md:pr-0">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            DekuGames
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Descubre increíbles juegos y DLCs para tu Switch
          </p>
          <button
            className="btn btn-primary text-base md:text-lg w-fit"
            onClick={() => navigate('/games')}
          >
            Explorar Juegos
          </button>
        </div>
      </div>

      {/* Featured Accounts Section */}
      <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-base-content">
          Ofertas Especiales
        </h2>
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {featuredAccounts.map((account) => (
              <div key={account.id}>
                <AccountCard account={account} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Single Games Section */}
      <div className="bg-base-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-base-content">
            Juegos Individuales
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {singleGames.map((account) => (
                <div key={account.id}>
                  <SingleGameCard account={account} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-base-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-base-content">
            Explorar por Categoría
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div
              className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              onClick={() => navigate('/games')}
            >
              <div className="card-body">
                <h3 className="card-title text-lg md:text-xl">
                  Juegos
                </h3>
                <p className="text-base-content/70 text-sm md:text-base">
                  Explora nuestra colección de juegos de Nintendo Switch
                </p>
              </div>
            </div>
            <div
              className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              onClick={() => navigate('/game-packs')}
            >
              <div className="card-body">
                <h3 className="card-title text-lg md:text-xl">
                  Packs de Juegos
                </h3>
                <p className="text-base-content/70 text-sm md:text-base">
                  Obtén múltiples juegos en un solo paquete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 