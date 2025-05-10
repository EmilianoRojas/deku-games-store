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

  const handleWhatsAppClick = (e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking the WhatsApp button
    
    const games = account.account_transactions
      .filter(t => t.type === 'game')
      .map(game => `- ${game.item_name}`)
      .join('\n');
    
    const dlcs = account.account_transactions
      .filter(t => t.type === 'dlc')
      .map(dlc => `- ${dlc.item_name}`)
      .join('\n');

    const message = `Hola! Me interesa comprar la cuenta ${account.id} que incluye:\n\nJuegos:\n${games}${dlcs ? `\n\nDLCs:\n${dlcs}` : ''}\n\nPrecio total: $${account.final_price}`;
    
    const whatsappUrl = `https://wa.me/+584125900162?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
        className={'card bg-base-100 shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-102 hover:cursor-pointer'}
        onClick={handleClick}
      >
        <figure className="relative pt-[120%] sm:pt-[162%]">
          {topGames.length === 1 ? (
            <img
              src={`/deku-games-store/game-covers/${topGames[0].cover_image}.png`}
              alt={topGames[0].item_name}
              className="absolute top-0 left-0 w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
              }}
            />
          ) : topGames.length > 1 ? (
            <div className="absolute top-0 left-0 w-full h-full grid gap-1" style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: topGames.length <= 2 ? '1fr' : '1fr 1fr'
            }}>
              <div className="w-full h-full">
                <img
                  src={`/deku-games-store/game-covers/${topGames[0].cover_image}.png`}
                  alt={topGames[0].item_name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
                  }}
                />
              </div>
              {topGames.length > 1 && (
                <div className="w-full h-full">
                  <img
                    src={`/deku-games-store/game-covers/${topGames[1].cover_image}.png`}
                    alt={topGames[1].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
              {topGames.length > 2 && (
                <div className="w-full h-full">
                  <img
                    src={`/deku-games-store/game-covers/${topGames[2].cover_image}.png`}
                    alt={topGames[2].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
              {topGames.length > 3 && (
                <div className="w-full h-full">
                  <img
                    src={`/deku-games-store/game-covers/${topGames[3].cover_image}.png`}
                    alt={topGames[3].item_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <img
              src="/deku-games-store/game-covers/game-placeholder.png"
              alt="No games"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          )}
        </figure>
        <div className="card-body p-3 sm:p-4">          
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <div className="badge badge-primary text-xs">
                {gameCount} Juegos
              </div>
              {dlcCount > 0 && (
                <div className="badge badge-secondary text-xs">
                  {dlcCount} DLCs
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg sm:text-xl font-bold text-neutral">
              ${account.final_price}
            </p>
            <button 
              onClick={handleWhatsAppClick}
              className="btn btn-primary btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog className={`modal ${open ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 text-right">
            {/* <h3 className="text-lg sm:text-xl font-bold">{account.id}</h3> */}
            <button 
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          {/* Games Section */}
          <h4 className="text-base sm:text-lg font-bold mb-4">
            Juegos ({gameCount})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {account.account_transactions
              .filter(t => t.type === 'game')
              .sort((a, b) => b.price - a.price)
              .map(game => (
                <div key={game.item_name}>
                  <GameCard game={{
                    id: game.account_id,
                    title: game.item_name,
                    description: `Purchased on ${new Date(game.purchase_date).toLocaleDateString()}`,
                    price: game.price,
                    coverImage: `/deku-games-store/game-covers/${game.cover_image}.png`,
                    type: 'game',
                    purchaseDate: game.purchase_date,
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = '/deku-games-store/game-covers/game-placeholder.png';
                    }
                  }} />
                </div>
              ))}
          </div>

          {/* DLCs Section */}
          {dlcCount > 0 && (
            <>
              <h4 className="text-base sm:text-lg font-bold mb-4">
                DLCs ({dlcCount})
              </h4>
              <div className="bg-base-200 rounded-lg p-3 sm:p-4">
                <ul className="menu menu-lg">
                  {account.account_transactions
                    .filter(t => t.type === 'dlc')
                    .map(dlc => (
                      <li key={dlc.item_name} className="flex justify-between text-sm sm:text-base">
                        <span>{dlc.item_name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}

          <div className="card bg-base-200 mt-6 sm:mt-8">
            <div className="card-body p-4">
              <h4 className="card-title text-base sm:text-lg">
                Detalles
              </h4>
              <p className="text-base-content text-sm sm:text-base">
                Total Juegos: {gameCount}
              </p>
              <p className="text-base-content text-sm sm:text-base">
                Total DLCs: {dlcCount}
              </p>
              <p className="text-lg sm:text-xl font-bold text-neutral mt-4">
                Precio: ${account.final_price}
              </p>
            </div>
            
          </div>
          <div className="flex justify-center items-center mt-2">
            
            <button 
              onClick={handleWhatsAppClick}
              className="btn btn-primary btn-sm"
            >
              Comprar
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>Cerrar</button>
        </form>
      </dialog>
    </>
  );
};

export default AccountCard; 