import { useState, useEffect } from 'react';
import AccountCard from '../components/common/AccountCard';
import { supabase } from '../supabaseClient';

const DLCs = () => {
  const [dlcs, setDlcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const dlcsPerPage = 12;

  useEffect(() => {
    fetchDLCs();
  }, [sortBy]);

  const fetchDLCs = async () => {
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

      // Filter accounts that have at least one DLC
      const transformedDLCs = accounts.filter(account => {
        const dlcItems = account.account_transactions.filter(t => t.type === 'dlc');
        return dlcItems.length > 0;
      });

      // Apply sorting
      transformedDLCs.sort((a, b) => {
        const aDLCs = a.account_transactions.filter(t => t.type === 'dlc');
        const bDLCs = b.account_transactions.filter(t => t.type === 'dlc');
        
        switch (sortBy) {
          case 'price_asc':
            return a.final_price - b.final_price;
          case 'price_desc':
            return b.final_price - a.final_price;
          case 'name_asc':
            return a.nickname.localeCompare(b.nickname);
          case 'name_desc':
            return b.nickname.localeCompare(a.nickname);
          default:
            return a.final_price - b.final_price;
        }
      });

      setDlcs(transformedDLCs);
    } catch (error) {
      console.error('Error fetching DLCs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter DLCs based on search query
  const filteredDLCs = dlcs.filter(dlc =>
    dlc.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dlc.account_transactions.some(t => 
      t.type === 'dlc' && t.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const indexOfLastDLC = currentPage * dlcsPerPage;
  const indexOfFirstDLC = indexOfLastDLC - dlcsPerPage;
  const currentDLCs = filteredDLCs.slice(indexOfFirstDLC, indexOfLastDLC);
  const totalPages = Math.ceil(filteredDLCs.length / dlcsPerPage);

  const handlePageChange = (value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-base-content">
        DLCs
      </h1>

      <p className="text-base-content/70 mb-8">
        Expand your gaming experience with additional content
      </p>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search DLCs"
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

      {/* DLCs Grid */}
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            {currentDLCs.map((dlc) => (
              <div key={dlc.id} className="flex-[0_0_calc(20%-24px)]">
                <AccountCard account={dlc} />
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

export default DLCs; 