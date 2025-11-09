/*
  ============================================
  GAME CARD COMPONENT
  ============================================
  
  This file handles the display of individual games.
  Each game shows as a card with:
  - Icon and name
  - Tier badge
  - Status indicator
  - Expandable details
  - Rating system
  - Notes
  - Action links
  
  ============================================
*/

const { useState } = React;

// ==================== MAIN GAME CARD COMPONENT ====================
const GameCard = ({ 
  game, 
  darkMode, 
  isExpanded, 
  onToggleExpand,
  onUpdateStatus,
  onUpdateRating,
  onUpdateNotes,
  onDelete
}) => {
  
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(game.notes || '');
  
  // Get background color based on status
  const getBg = (status) => {
    if (darkMode) {
      const bgs = {
        not_downloaded: 'bg-gray-800',
        downloaded: 'bg-blue-900',
        playing: 'bg-green-900',
        completed: 'bg-purple-900',
        favorite: 'bg-yellow-900'
      };
      return bgs[status] || 'bg-gray-800';
    }
    const bgs = {
      not_downloaded: 'bg-white',
      downloaded: 'bg-blue-50',
      playing: 'bg-green-50',
      completed: 'bg-purple-50',
      favorite: 'bg-yellow-50'
    };
    return bgs[status] || 'bg-white';
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    const iconMap = {
      not_downloaded: { name: 'circle', className: 'text-gray-400' },
      downloaded: { name: 'download', className: 'text-blue-500' },
      playing: { name: 'play', className: 'text-green-500' },
      completed: { name: 'check', className: 'text-purple-500' },
      favorite: { name: 'star', className: 'text-yellow-500', fill: 'currentColor' }
    };
    const icon = iconMap[status] || iconMap.not_downloaded;
    return <Icon name={icon.name} size={20} className={icon.className} fill={icon.fill} />;
  };
  
  // Get tier badge
  const getTierBadge = (tier) => {
    const tierInfo = APP_CONFIG.TIERS[tier];
    if (!tierInfo) return null;
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${tierInfo.color} text-white`}>
        {tierInfo.label}
      </span>
    );
  };
  
  // Handle save notes
  const handleSaveNotes = () => {
    onUpdateNotes(game.id, tempNotes);
    setIsEditingNotes(false);
  };
  
  // Handle cancel notes
  const handleCancelNotes = () => {
    setTempNotes(game.notes || '');
    setIsEditingNotes(false);
  };
  
  return (
    <div className={`${getBg(game.status)} rounded-xl shadow-lg overflow-hidden transition-all`}>
      
      {/* ========== COLLAPSED VIEW ========== */}
      <div
        onClick={onToggleExpand}
        className="p-4 cursor-pointer active:opacity-80 transition-opacity"
      >
        <div className="flex items-start justify-between gap-3">
          
          {/* Left side: Icon + Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Game Icon */}
            <div className="text-3xl flex-shrink-0">
              {game.icon || '🎮'}
            </div>
            
            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {game.name}
                </h3>
                {getTierBadge(game.tier)}
              </div>
              
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <div>📂 {game.genre} • ⚡ {game.fps} FPS</div>
                {game.hours && <div>⏱️ {game.hours} hours</div>}
                
                {/* Rating stars (small preview) */}
                {APP_CONFIG.FEATURES.ENABLE_RATINGS && game.rating > 0 && (
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Icon 
                        key={i} 
                        name="star" 
                        size={12} 
                        fill={i <= game.rating ? 'currentColor' : 'none'} 
                        className={i <= game.rating ? 'text-yellow-500' : 'text-gray-400'} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side: Status + Expand */}
          <div className="flex flex-col items-center gap-2">
            <div onClick={(e) => { e.stopPropagation(); onUpdateStatus(game.id); }}>
              {getStatusIcon(game.status)}
            </div>
            <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
          </div>
        </div>
      </div>
      
      {/* ========== EXPANDED VIEW ========== */}
      {isExpanded && (
        <div className={`px-4 pb-4 space-y-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
          
          {/* Description */}
          {game.desc && (
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {game.desc}
            </p>
          )}
          
          {/* Rating Section */}
          {APP_CONFIG.FEATURES.ENABLE_RATINGS && (
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Your Rating:
              </p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onUpdateRating(game.id, i); 
                    }}
                    className="focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Icon 
                      name="star" 
                      size={20} 
                      fill={i <= (game.rating || 0) ? 'currentColor' : 'none'} 
                      className={i <= (game.rating || 0) ? 'text-yellow-500' : 'text-gray-400'} 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes Section */}
          {APP_CONFIG.FEATURES.ENABLE_NOTES && (
            <div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Notes:
              </p>
              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    maxLength={APP_CONFIG.VALIDATION.MAX_NOTES_LENGTH}
                    className={`w-full p-2 border rounded text-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    rows="3"
                    placeholder="Add your thoughts about this game..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="text-xs text-right opacity-60">
                    {tempNotes.length} / {APP_CONFIG.VALIDATION.MAX_NOTES_LENGTH}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveNotes(); }}
                      className="flex-1 bg-green-500 text-white p-2 rounded text-sm font-bold hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelNotes(); }}
                      className="flex-1 bg-gray-300 text-gray-700 p-2 rounded text-sm font-bold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsEditingNotes(true); 
                    setTempNotes(game.notes || ''); 
                  }}
                  className={`w-full p-2 border rounded text-sm text-left ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {game.notes || 'Add notes...'}
                </button>
              )}
            </div>
          )}
          
          {/* Action Links */}
          {APP_CONFIG.FEATURES.ENABLE_ONLINE_FEATURES && (
            <div className="space-y-2">
              {/* Trailer Button */}
              {APP_CONFIG.FEATURES.ENABLE_TRAILERS && game.trailer && (
                <a
                  href={game.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon name="youtube" size={18} /> Watch Trailer
                </a>
              )}
              
              {/* Gameranx Button */}
              {APP_CONFIG.FEATURES.ENABLE_GAMERANX && (
                <a
                  href={APP_CONFIG.LINKS.GAMERANX_SEARCH.replace('{GAME}', encodeURIComponent(game.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon name="book" size={18} /> Gameranx Review
                </a>
              )}
            </div>
          )}
          
          {/* Delete Button (only for custom games) */}
          {APP_CONFIG.FEATURES.ENABLE_DELETE_GAME && game.id >= 1000 && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(game.id); }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <Icon name="trash" size={16} /> Delete Game
            </button>
          )}
        </div>
      )}
    </div>
  );
};


// Make GameCard available globally
window.GameCard = GameCard;

/*
  ============================================
  HOW TO USE GAME CARD:
  ============================================
  
  <GameCard
    game={gameObject}
    darkMode={isDark}
    isExpanded={expandedId === game.id}
    onToggleExpand={() => toggleExpand(game.id)}
    onUpdateStatus={(id) => updateStatus(id)}
    onUpdateRating={(id, rating) => updateRating(id, rating)}
    onUpdateNotes={(id, notes) => updateNotes(id, notes)}
    onDelete={(id) => deleteGame(id)}
  />
  
  ============================================
  GAME OBJECT STRUCTURE:
  ============================================
  
  {
    id: 1,
    name: "Game Name",
    genre: "Genre",
    fps: "30-60",
    tier: "S",
    priority: "HIGH",
    trailer: "https://youtube.com/...",
    desc: "Description",
    hours: "10-15",
    icon: "🎮",
    status: "playing",      // Optional
    rating: 4,              // Optional (1-5)
    notes: "My thoughts"    // Optional
  }
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  Change card colors:
  - Edit getBg() function
  
  Change layout:
  - Modify JSX structure
  
  Add new fields:
  - Add to game object in data.js
  - Display in card JSX
  
  Remove features:
  - Comment out sections
  - Or disable in config.js
  
  ============================================
  PROPS:
  ============================================
  
  game: object (required)
    - The game data object
  
  darkMode: boolean (required)
    - Whether dark mode is active
  
  isExpanded: boolean (required)
    - Whether this card is expanded
  
  onToggleExpand: function (required)
    - Called when user clicks to expand/collapse
  
  onUpdateStatus: function (required)
    - Called when status icon is clicked
    - Receives: game.id
  
  onUpdateRating: function (optional)
    - Called when rating star is clicked
    - Receives: game.id, rating (1-5)
  
  onUpdateNotes: function (optional)
    - Called when notes are saved
    - Receives: game.id, notes (string)
  
  onDelete: function (optional)
    - Called when delete button clicked
    - Receives: game.id
  
  ============================================
*/