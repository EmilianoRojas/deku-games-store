import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCard from '../components/common/AccountCard';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [featuredAccounts, setFeaturedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedAccounts();
  }, []);

  const fetchFeaturedAccounts = async () => {
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
        .limit(6);

      if (error) throw error;
      setFeaturedAccounts(data);
    } catch (error) {
      console.error('Error fetching featured accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-base-300 text-base-content mb-8 bg-cover bg-center bg-no-repeat h-[400px]"
           style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-base-300 bg-opacity-70" />
        <div className="relative h-full flex flex-col justify-center px-4 md:px-6 md:pr-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Nintendo Store
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Discover amazing games and DLCs for your Nintendo Switch
          </p>
          <button
            className="btn btn-primary text-lg"
            onClick={() => navigate('/games')}
          >
            Browse Games
          </button>
        </div>
      </div>

      {/* Featured Accounts Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-base-content">
          Featured Accounts
        </h2>
        <div className="flex flex-wrap gap-6">
          {featuredAccounts.map((account) => (
            <div key={account.id} className="flex-[0_0_calc(20%-24px)]">
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-base-content">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="card bg-base-100 hover:bg-base-200 transition-colors cursor-pointer"
              onClick={() => navigate('/games')}
            >
              <div className="card-body">
                <h3 className="card-title text-xl">
                  Games
                </h3>
                <p className="text-base-content/70">
                  Browse our collection of Nintendo Switch games
                </p>
              </div>
            </div>
            <div
              className="card bg-base-100 hover:bg-base-200 transition-colors cursor-pointer"
              onClick={() => navigate('/game-packs')}
            >
              <div className="card-body">
                <h3 className="card-title text-xl">
                  Game Packs
                </h3>
                <p className="text-base-content/70">
                  Get multiple games in one package
                </p>
              </div>
            </div>
            <div
              className="card bg-base-100 hover:bg-base-200 transition-colors cursor-pointer"
              onClick={() => navigate('/dlcs')}
            >
              <div className="card-body">
                <h3 className="card-title text-xl">
                  DLCs
                </h3>
                <p className="text-base-content/70">
                  Expand your gaming experience with DLCs
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