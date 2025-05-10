const GameCard = ({ game }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-102 hover:cursor-pointer h-full">
      <figure className="h-[280px]">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/game-covers/game-placeholder.png';
          }}
        />
      </figure>
      <div className="card-body flex flex-col p-4">
        <h2 className="card-title text-sm">
          {game.title}
        </h2>
        
        <div className="flex gap-2 mt-auto">
          {game.type === 'game' && (
            <div className="badge badge-primary">
              Juego
            </div>
          )}
          {game.type === 'dlc' && (
            <div className="badge badge-secondary">
              DLC
            </div>
          )}
          {game.type === 'pack' && (
            <div className="badge badge-accent">
              Game Pack
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 