import { useState, useEffect } from 'react';
import AccountCard from '../components/common/AccountCard';
import { supabase } from '../supabaseClient';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  useEffect(() => {
    fetchGames();
  }, [sortBy]);

  const fetchGames = async () => {
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

      // Filter accounts that have exactly one game and no DLCs
      const transformedGames = accounts.filter(account => {
        const games = account.account_transactions.filter(t => t.type === 'game');
        const dlcs = account.account_transactions.filter(t => t.type === 'dlc');
        return games.length === 1 && dlcs.length === 0; // Only single games
      });

      // Apply sorting
      transformedGames.sort((a, b) => {
        const aGame = a.account_transactions.find(t => t.type === 'game');
        const bGame = b.account_transactions.find(t => t.type === 'game');
        
        switch (sortBy) {
          case 'price_asc':
            return a.final_price - b.final_price;
          case 'price_desc':
            return b.final_price - a.final_price;
          case 'name_asc':
            return aGame.item_name.localeCompare(bGame.item_name);
          case 'name_desc':
            return bGame.item_name.localeCompare(aGame.item_name);
          default:
            return a.final_price - b.final_price;
        }
      });

      setGames(transformedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter games based on search query
  const filteredGames = games.filter(game => {
    const gameTransaction = game.account_transactions.find(t => t.type === 'game');
    return game.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
           gameTransaction.item_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handlePageChange = (value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-base-content">
        Games
      </h1>

      <p className="text-base-content/70 mb-8">
        Browse our collection of Nintendo Switch games
      </p>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search Games"
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
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            {currentGames.map((game) => (
              <div key={game.id} className="flex-[0_0_calc(20%-24px)]">
                <AccountCard account={game} />
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

export default Games; 