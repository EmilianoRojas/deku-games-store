import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

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
        .textSearch('account_transactions.item_name', query);

      if (error) throw error;

      // Filter results to only include accounts with matching transactions
      const filteredResults = data.filter(account => 
        account.account_transactions.some(t => 
          t.item_name.toLowerCase().includes(query.toLowerCase())
        )
      );

      setSearchResults(filteredResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
  };

  const handleResultClick = (account) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/account/${account.id}`);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">DekuGames</Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/games">Juegos</Link></li>
          <li><Link to="/game-packs">Packs de Juegos</Link></li>
          <li><Link to="/dlcs">DLCs</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="form-control hidden md:block relative">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchQuery}
            onChange={handleSearch}
            className="input input-bordered w-64"
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-base-100 shadow-lg rounded-box z-50 max-h-96 overflow-y-auto">
              {searchResults.map((account) => (
                <div
                  key={account.id}
                  className="p-2 hover:bg-base-200 cursor-pointer"
                  onClick={() => handleResultClick(account)}
                >
                  <div className="font-medium">{account.nickname}</div>
                  <div className="text-sm text-base-content/70">
                    {account.account_transactions
                      .filter(t => t.item_name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(t => t.item_name)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown dropdown-end md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/games">Juegos</Link></li>
            <li><Link to="/game-packs">Packs de Juegos</Link></li>
            <li><Link to="/dlcs">DLCs</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 