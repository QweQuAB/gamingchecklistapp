/*
  ============================================
  MAIN APP FILE
  ============================================
  
  This is the heart of the application.
  It brings together all the other modules and
  manages the overall app state.
  
  DEPENDENCIES (loaded before this file):
  - config.js
  - data.js
  - storage.js
  - icons.js
  - ui-components.js
  - game-card.js
  - features.js
  
  ============================================
*/

const { useState, useEffect } = React;

// ==================== MAIN APP COMPONENT ====================
const GamingChecklistApp = () => {
  
  // ========== STATE MANAGEMENT ==========
  
  // Games list (main data)
  const [games, setGames] = useState(() => StorageManager.loadGames());
  
  // Dark mode
  const [darkMode, setDarkMode] = useState(() => StorageManager.loadDarkMode());
  
  // UI state
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [filter, setFilter] = useState(APP_CONFIG.DEFAULTS.FILTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(APP_CONFIG.DEFAULTS.SORT_BY);
  const [showSort, setShowSort] = useState(false);
  const [showAddGame, setShowAddGame] = useState(false);
  
  // New game form state
  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    fps: '',
    tier: APP_CONFIG.DEFAULTS.NEW_GAME.tier,
    priority: APP_CONFIG.DEFAULTS.NEW_GAME.priority,
    trailer: '',
    desc: '',
    hours: '',
    icon: APP_CONFIG.DEFAULTS.NEW_GAME.icon
  });
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  
  // ========== EFFECTS ==========
  
  // Save games whenever they change
  useEffect(() => {
    StorageManager.saveGames(games);
  }, [games]);
  
  // Save dark mode whenever it changes
  useEffect(() => {
    StorageManager.saveDarkMode(darkMode);
  }, [darkMode]);
  
  // Hide loading screen on mount
  useEffect(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hide');
      }, APP_CONFIG.UI.LOADING_MIN_TIME);
    }
  }, []);
  
  
  // ========== COMPUTED VALUES ==========
  
  // Apply search, filter, and sort
  let displayedGames = games;
  displayedGames = GameFeatures.searchGames(displayedGames, searchTerm);
  displayedGames = GameFeatures.filterGames(displayedGames, filter);
  displayedGames = GameFeatures.sortGames(displayedGames, sortBy);
  
  // Calculate statistics
  const stats = GameFeatures.calculateStats(games);
  
  // Theme classes
  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900' 
    : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
  
  
  // ========== EVENT HANDLERS ==========
  
  // Toggle game expansion
  const handleToggleExpand = (gameId) => {
    setExpandedGameId(expandedGameId === gameId ? null : gameId);
  };
  
  // Update game status
  const handleUpdateStatus = (gameId) => {
    const updated = GameFeatures.updateGameStatus(games, gameId);
    setGames(updated);
  };
  
  // Update game rating
  const handleUpdateRating = (gameId, rating) => {
    const updated = GameFeatures.updateGameRating(games, gameId, rating);
    setGames(updated);
  };
  
  // Update game notes
  const handleUpdateNotes = (gameId, notes) => {
    const updated = GameFeatures.updateGameNotes(games, gameId, notes);
    setGames(updated);
  };
  
  // Delete game
  const handleDeleteGame = (gameId) => {
    const updated = GameFeatures.deleteGame(games, gameId);
    setGames(updated);
    if (expandedGameId === gameId) {
      setExpandedGameId(null);
    }
  };
  
  // Add new game
  const handleAddGame = (e) => {
    e.preventDefault();
    
    // Validate
    const validation = GameFeatures.validateGameData(newGame);
    if (!validation.isValid) {
      alert('Validation errors:\n' + validation.errors.join('\n'));
      return;
    }
    
    // Add game
    const updated = GameFeatures.addNewGame(games, newGame);
    setGames(updated);
    
    // Reset form
    setNewGame({
      name: '',
      genre: '',
      fps: '',
      tier: APP_CONFIG.DEFAULTS.NEW_GAME.tier,
      priority: APP_CONFIG.DEFAULTS.NEW_GAME.priority,
      trailer: '',
      desc: '',
      hours: '',
      icon: APP_CONFIG.DEFAULTS.NEW_GAME.icon
    });
    
    setShowAddGame(false);
  };
  
  // Handle new game form input
  const handleNewGameChange = (field, value) => {
    setNewGame(prev => ({ ...prev, [field]: value }));
  };
  
  // Export data
  const handleExport = () => {
    StorageManager.exportToFile(games);
  };
  
  // Import data
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      StorageManager.importFromFile(file, (imported) => {
        if (window.confirm(`Import ${imported.length} games? This will replace your current list.`)) {
          setGames(imported);
        }
      });
    }
    // Reset file input
    e.target.value = '';
  };
  
  
  // ========== RENDER ==========
  
  const { 
    Header, 
    StatsCards, 
    FilterButtons, 
    SearchBar, 
    BackupButtons,
    EmptyState,
    Legend,
    Footer
  } = window.UIComponents;
  
  return (
    <div className={`min-h-screen ${bgClass} p-3 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header with progress bar */}
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          stats={stats} 
        />
        
        {/* Search bar with sort */}
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSort={showSort}
          setShowSort={setShowSort}
          darkMode={darkMode}
        />
        
        {/* Sort options (appears when showSort is true) */}
        {showSort && APP_CONFIG.FEATURES.ENABLE_SORTING && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-3 mb-4`}>
            <div className="flex gap-2 flex-wrap">
              {[
                ['tier', 'By Tier'],
                ['name', 'By Name'],
                ['fps', 'By FPS'],
                ['rating', 'By Rating']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    sortBy === key 
                      ? 'bg-purple-600 text-white' 
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Stats cards */}
        <StatsCards stats={stats} darkMode={darkMode} />
        
        {/* Filter buttons */}
        <FilterButtons 
          filter={filter}
          setFilter={setFilter}
          stats={stats}
          darkMode={darkMode}
        />
        
        {/* Backup buttons */}
        <BackupButtons 
          onExport={handleExport}
          onImport={handleImport}
          darkMode={darkMode}
        />
        
        {/* Add game button/form */}
        {APP_CONFIG.FEATURES.ENABLE_ADD_GAME && (
          <div className="mb-4">
            {!showAddGame ? (
              <button
                onClick={() => setShowAddGame(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 font-bold shadow-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Icon name="plus" size={20} /> Add New Game
              </button>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-4`}>
                <form onSubmit={handleAddGame} className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Add New Game
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowAddGame(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ❌
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Game Name *"
                    value={newGame.name}
                    onChange={e => handleNewGameChange('name', e.target.value)}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Genre"
                      value={newGame.genre}
                      onChange={e => handleNewGameChange('genre', e.target.value)}
                      className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="FPS (e.g. 30-40)"
                      value={newGame.fps}
                      onChange={e => handleNewGameChange('fps', e.target.value)}
                      className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Hours (e.g. 10-12)"
                      value={newGame.hours}
                      onChange={e => handleNewGameChange('hours', e.target.value)}
                      className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="Icon (emoji)"
                      value={newGame.icon}
                      onChange={e => handleNewGameChange('icon', e.target.value)}
                      className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <select
                    value={newGame.tier}
                    onChange={e => handleNewGameChange('tier', e.target.value)}
                    className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                  >
                    {Object.keys(APP_CONFIG.TIERS).map(tier => (
                      <option key={tier} value={tier}>
                        {tier} - {APP_CONFIG.TIERS[tier].label}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="url"
                    placeholder="YouTube Trailer URL"
                    value={newGame.trailer}
                    onChange={e => handleNewGameChange('trailer', e.target.value)}
                    className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={newGame.desc}
                    onChange={e => handleNewGameChange('desc', e.target.value)}
                    className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                    rows="2"
                  />
                  
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-green-500 text-white p-2 rounded font-bold hover:bg-green-600 transition-colors"
                    >
                      Save Game
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddGame(false)} 
                      className="flex-1 bg-gray-300 text-gray-700 p-2 rounded font-bold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        
        {/* Game list */}
        <div className="space-y-3">
          {displayedGames.length > 0 ? (
            displayedGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                darkMode={darkMode}
                isExpanded={expandedGameId === game.id}
                onToggleExpand={() => handleToggleExpand(game.id)}
                onUpdateStatus={handleUpdateStatus}
                onUpdateRating={handleUpdateRating}
                onUpdateNotes={handleUpdateNotes}
                onDelete={handleDeleteGame}
              />
            ))
          ) : (
            <EmptyState 
              darkMode={darkMode}
              searchTerm={searchTerm}
              filter={filter}
            />
          )}
        </div>
        
        {/* Legend */}
        <Legend darkMode={darkMode} />
        
        {/* Footer */}
        <Footer darkMode={darkMode} />
        
      </div>
    </div>
  );
};

// ========== RENDER APP ==========
ReactDOM.render(<GamingChecklistApp />, document.getElementById('root'));

/*
  ============================================
  HOW THIS FILE WORKS:
  ============================================
  
  1. Initializes state from localStorage
  2. Renders all UI components
  3. Handles user interactions
  4. Updates state and saves to localStorage
  5. Re-renders when state changes
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  Add new state:
  - const [myState, setMyState] = useState(initialValue);
  
  Add new effect:
  - useEffect(() => { /* code */ }, [dependency]);
  
  Add new handler:
  - const handleMyAction = () => { /* code */ };
  
  Modify layout:
  - Change JSX structure in return statement
  
  ============================================
*/