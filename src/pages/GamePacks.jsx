import { useState, useEffect } from 'react';
import AccountCard from '../components/common/AccountCard';
import { supabase } from '../supabaseClient';

const GamePacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('games_asc');
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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-base-content">
        Packs de Juegos
      </h1>

      <p className="text-base-content/70 mb-6 md:mb-8 text-sm md:text-base">
        Obten múltiples juegos en un solo paquete a un precio reducido
      </p>

      {/* Filters and Search */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 md:gap-4">
        <input
          type="text"
          placeholder="Buscar Packs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full sm:flex-grow"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select select-bordered w-full sm:w-[200px]"
        >
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="games_asc">Juegos: Menos a Más</option>
          <option value="games_desc">Juegos: Más a Menos</option>
        </select>
      </div>

      {/* Game Packs Grid */}
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {currentPacks.map((pack) => (
              <div key={pack.id}>
                <AccountCard account={pack} />
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

export default GamePacks; 