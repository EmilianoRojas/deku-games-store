import { useState } from 'react';
import GameCard from './GameCard';

const AccountCard = ({ account }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    // Only open modal if there's more than one game
    if (account.account_transactions.filter(t => t.type === 'game').length > 1) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Get the top 4 highest priced games for the cover image
  const topGames = account.account_transactions
    .filter(t => t.type === 'game')
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  // Count games and DLCs
  const gameCount = account.account_transactions.filter(t => t.type === 'game').length;
  const dlcCount = account.account_transactions.filter(t => t.type === 'dlc').length;

  return (
    <>
      <div 
        className={`card bg-base-100 shadow-xl transition-all duration-200 ${account.account_transactions.filter(t => t.type === 'game').length > 1 ? 'hover:shadow-2xl hover:scale-102 hover:cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        <figure className="relative pt-[162%]">
          {topGames.length === 1 ? (
            <img
              src={`/game-covers/${topGames[0].cover_image}.png`}
              alt={topGames[0].item_name}
              className="absolute top-0 left-0 w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/game-covers/game-placeholder.png';
              }}
            />
          ) : topGames.length > 1 ? (
            <div className="absolute top-0 left-0 w-full h-full grid gap-1" style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: topGames.length <= 2 ? '1fr' : '1fr 1fr'
            }}>
              <div className="w-full h-full">
                <img
                  src={`/game-covers/${topGames[0].cover_image}.png`}
                  alt={topGames[0].item_name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/game-covers/game-placeholder.png';
                  }}
                />
              </div>
              {topGames.length > 1 && (
                <div className="w-full h-full">
                  <img
                    src={`/game-covers/${topGames[1].cover_image}.png`}
                    alt={topGames[1].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
              {topGames.length > 2 && (
                <div className="w-full h-full">
                  <img
                    src={`/game-covers/${topGames[2].cover_image}.png`}
                    alt={topGames[2].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
              {topGames.length > 3 && (
                <div className="w-full h-full">
                  <img
                    src={`/game-covers/${topGames[3].cover_image}.png`}
                    alt={topGames[3].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <img
              src="/game-covers/game-placeholder.png"
              alt="No games"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {account.nickname}
          </h2>
          
          <div className="flex gap-2">
            <div className="badge badge-primary">
              {gameCount} Games
            </div>
            {dlcCount > 0 && (
              <div className="badge badge-secondary">
                {dlcCount} DLCs
              </div>
            )}
          </div>

          <p className="text-base-content/70">
            Complete Nintendo account with {gameCount} games and {dlcCount} DLCs
          </p>

          <p className="text-xl font-bold text-primary">
            ${account.final_price}
          </p>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog className={`modal ${open ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{account.nickname}</h3>
            <button 
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          {/* Games Section */}
          <h4 className="text-lg font-bold mb-4">
            Games ({gameCount})
          </h4>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {account.account_transactions
              .filter(t => t.type === 'game')
              .map(game => (
                <div key={game.item_name}>
                  <GameCard game={{
                    id: game.item_name,
                    title: game.item_name,
                    description: `Purchased on ${new Date(game.purchase_date).toLocaleDateString()}`,
                    price: game.price,
                    coverImage: `/game-covers/${game.cover_image}.png`,
                    type: 'game',
                    purchaseDate: game.purchase_date,
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = '/game-covers/game-placeholder.png';
                    }
                  }} />
                </div>
              ))}
          </div>

          {/* DLCs Section */}
          {dlcCount > 0 && (
            <>
              <h4 className="text-lg font-bold mb-4">
                DLCs ({dlcCount})
              </h4>
              <div className="bg-base-200 rounded-lg p-4">
                <ul className="menu menu-lg">
                  {account.account_transactions
                    .filter(t => t.type === 'dlc')
                    .map(dlc => (
                      <li key={dlc.item_name} className="flex justify-between">
                        <span>{dlc.item_name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}

          <div className="card bg-base-200 mt-8">
            <div className="card-body">
              <h4 className="card-title">
                Account Details
              </h4>
              <p className="text-base-content">
                Total Games: {gameCount}
              </p>
              <p className="text-base-content">
                Total DLCs: {dlcCount}
              </p>
              <p className="text-xl font-bold text-primary mt-4">
                Total Price: ${account.final_price}
              </p>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AccountCard; 