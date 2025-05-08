import { useState, useEffect } from 'react';
import AccountCard from '../components/common/AccountCard';
import { supabase } from '../supabaseClient';

const GamePacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const packsPerPage = 12;

  useEffect(() => {
    fetchGamePacks();
  }, [sortBy]);

  const fetchGamePacks = async () => {
    try {
      setLoading(true);
      const { data: accounts, error: accountsError } = await supabase
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
        `);

      if (accountsError) throw accountsError;

      // Filter accounts that have more than one game
      const transformedPacks = accounts.filter(account => {
        const games = account.account_transactions.filter(t => t.type === 'game');
        return games.length > 1; // Only game packs
      });

      // Apply sorting
      transformedPacks.sort((a, b) => {
        const aGames = a.account_transactions.filter(t => t.type === 'game').length;
        const bGames = b.account_transactions.filter(t => t.type === 'game').length;
        
        switch (sortBy) {
          case 'price_asc':
            return a.final_price - b.final_price;
          case 'price_desc':
            return b.final_price - a.final_price;
          case 'games_asc':
            return aGames - bGames;
          case 'games_desc':
            return bGames - aGames;
          default:
            return a.final_price - b.final_price;
        }
      });

      setPacks(transformedPacks);
    } catch (error) {
      console.error('Error fetching game packs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter packs based on search query
  const filteredPacks = packs.filter(pack =>
    pack.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack.account_transactions.some(t => 
      t.type === 'game' && t.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const indexOfLastPack = currentPage * packsPerPage;
  const indexOfFirstPack = indexOfLastPack - packsPerPage;
  const currentPacks = filteredPacks.slice(indexOfFirstPack, indexOfLastPack);
  const totalPages = Math.ceil(filteredPacks.length / packsPerPage);

  const handlePageChange = (value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-base-content">
        Game Packs
      </h1>

      <p className="text-base-content/70 mb-8">
        Get multiple games in one package at a discounted price
      </p>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Packs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered flex-grow min-w-[200px]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered min-w-[200px]"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="games_asc">Games: Fewest First</option>
          <option value="games_desc">Games: Most First</option>
        </select>
      </div>

      {/* Game Packs Grid */}
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            {currentPacks.map((pack) => (
              <div key={pack.id} className="flex-[0_0_calc(20%-24px)]">
                <AccountCard account={pack} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`join-item btn ${
                      currentPage === page ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GamePacks; 