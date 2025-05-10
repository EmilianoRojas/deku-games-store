import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SingleGameCard from '../components/common/SingleGameCard';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-base-content">
        Juegos Individuales
      </h1>

      <p className="text-base-content/70 mb-6 md:mb-8 text-sm md:text-base">
        Explora nuestra colección de juegos de Switch
      </p>

      {/* Filters and Search */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 md:gap-4">
        <input
          type="text"
          placeholder="Search Games"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full sm:flex-grow"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered w-full sm:w-[200px]"
        >
          <option value="name_asc">Nombre: A a Z</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="name_desc">Nombre: Z a A</option>
        </select>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {currentGames.map((game) => (
              <div key={game.id}>
                <SingleGameCard account={game} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-8">
              <div className="join">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`join-item btn btn-sm md:btn-md ${
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