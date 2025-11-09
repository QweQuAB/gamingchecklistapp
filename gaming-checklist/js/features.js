/*
  ============================================
  FEATURES & LOGIC
  ============================================
  
  This file contains the main app features:
  - Search functionality
  - Filter functionality
  - Sort functionality
  - Add new game
  - Statistics calculation
  
  ============================================
*/

// ==================== SEARCH FUNCTION ====================
const searchGames = (games, searchTerm) => {
  if (!searchTerm || !APP_CONFIG.FEATURES.ENABLE_SEARCH) {
    return games;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return games.filter(game => {
    const nameMatch = game.name.toLowerCase().includes(term);
    const genreMatch = game.genre.toLowerCase().includes(term);
    const descMatch = game.desc && game.desc.toLowerCase().includes(term);
    
    return nameMatch || genreMatch || descMatch;
  });
};


// ==================== FILTER FUNCTION ====================
const filterGames = (games, filter) => {
  if (!APP_CONFIG.FEATURES.ENABLE_FILTERS || filter === 'all') {
    return games;
  }
  
  return games.filter(game => game.status === filter);
};


// ==================== SORT FUNCTION ====================
const sortGames = (games, sortBy) => {
  if (!APP_CONFIG.FEATURES.ENABLE_SORTING) {
    return games;
  }
  
  const sorted = [...games];
  
  switch(sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
      
    case 'fps':
      sorted.sort((a, b) => {
        // Extract max FPS from "30-60" format
        const aFps = parseInt(a.fps.split('-')[1] || a.fps.split('-')[0] || 0);
        const bFps = parseInt(b.fps.split('-')[1] || b.fps.split('-')[0] || 0);
        return bFps - aFps; // Descending order
      });
      break;
      
    case 'rating':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
      
    case 'tier':
    default:
      const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'R': 4 };
      sorted.sort((a, b) => {
        if (tierOrder[a.tier] !== tierOrder[b.tier]) {
          return tierOrder[a.tier] - tierOrder[b.tier];
        }
        return a.name.localeCompare(b.name);
      });
      break;
  }
  
  return sorted;
};


// ==================== CALCULATE STATISTICS ====================
const calculateStats = (games) => {
  const total = games.length;
  const not_downloaded = games.filter(g => g.status === APP_CONFIG.STATUS.NOT_DOWNLOADED).length;
  const downloaded = games.filter(g => g.status === APP_CONFIG.STATUS.DOWNLOADED).length;
  const playing = games.filter(g => g.status === APP_CONFIG.STATUS.PLAYING).length;
  const completed = games.filter(g => g.status === APP_CONFIG.STATUS.COMPLETED).length;
  const favorite = games.filter(g => g.status === APP_CONFIG.STATUS.FAVORITE).length;
  
  const completedCount = completed + favorite;
  const completionPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  
  return {
    total,
    not_downloaded,
    downloaded,
    playing,
    completed,
    favorite,
    completionPercent
  };
};


// ==================== UPDATE GAME STATUS ====================
const updateGameStatus = (games, gameId) => {
  return games.map(game => {
    if (game.id === gameId) {
      const currentIndex = APP_CONFIG.STATUS_CYCLE.indexOf(game.status);
      const nextIndex = (currentIndex + 1) % APP_CONFIG.STATUS_CYCLE.length;
      const nextStatus = APP_CONFIG.STATUS_CYCLE[nextIndex];
      
      return { ...game, status: nextStatus };
    }
    return game;
  });
};


// ==================== UPDATE GAME RATING ====================
const updateGameRating = (games, gameId, rating) => {
  if (!APP_CONFIG.FEATURES.ENABLE_RATINGS) {
    return games;
  }
  
  return games.map(game => 
    game.id === gameId ? { ...game, rating } : game
  );
};


// ==================== UPDATE GAME NOTES ====================
const updateGameNotes = (games, gameId, notes) => {
  if (!APP_CONFIG.FEATURES.ENABLE_NOTES) {
    return games;
  }
  
  // Validate notes length
  const trimmedNotes = notes.trim();
  if (trimmedNotes.length > APP_CONFIG.VALIDATION.MAX_NOTES_LENGTH) {
    alert(`Notes too long! Maximum ${APP_CONFIG.VALIDATION.MAX_NOTES_LENGTH} characters.`);
    return games;
  }
  
  return games.map(game => 
    game.id === gameId ? { ...game, notes: trimmedNotes } : game
  );
};


// ==================== DELETE GAME ====================
const deleteGame = (games, gameId) => {
  if (!APP_CONFIG.FEATURES.ENABLE_DELETE_GAME) {
    return games;
  }
  
  // Don't allow deleting default games (id < 1000)
  const game = games.find(g => g.id === gameId);
  if (game && game.id < 1000) {
    alert('Cannot delete default games!');
    return games;
  }
  
  if (!window.confirm(`Delete "${game.name}"? This cannot be undone.`)) {
    return games;
  }
  
  return games.filter(g => g.id !== gameId);
};


// ==================== ADD NEW GAME ====================
const addNewGame = (games, newGameData) => {
  if (!APP_CONFIG.FEATURES.ENABLE_ADD_GAME) {
    console.error('Add game feature is disabled');
    return games;
  }
  
  // Validate required fields
  if (!newGameData.name || !newGameData.name.trim()) {
    alert('Game name is required!');
    return games;
  }
  
  if (newGameData.name.length > APP_CONFIG.VALIDATION.MAX_GAME_NAME_LENGTH) {
    alert(`Game name too long! Maximum ${APP_CONFIG.VALIDATION.MAX_GAME_NAME_LENGTH} characters.`);
    return games;
  }
  
  // Create new game object
  const newGame = {
    id: Date.now(), // Use timestamp as unique ID
    name: newGameData.name.trim(),
    genre: newGameData.genre.trim() || 'Unknown',
    fps: newGameData.fps.trim() || 'N/A',
    tier: newGameData.tier || APP_CONFIG.DEFAULTS.NEW_GAME.tier,
    priority: newGameData.priority || APP_CONFIG.DEFAULTS.NEW_GAME.priority,
    trailer: newGameData.trailer.trim() || '',
    desc: newGameData.desc.trim() || '',
    hours: newGameData.hours.trim() || '',
    icon: newGameData.icon || APP_CONFIG.DEFAULTS.NEW_GAME.icon,
    status: APP_CONFIG.DEFAULTS.NEW_GAME.status,
    rating: APP_CONFIG.DEFAULTS.NEW_GAME.rating,
    notes: APP_CONFIG.DEFAULTS.NEW_GAME.notes
  };
  
  console.log('Adding new game:', newGame);
  return [...games, newGame];
};


// ==================== VALIDATE GAME DATA ====================
const validateGameData = (gameData) => {
  const errors = [];
  
  // Check name
  if (!gameData.name || gameData.name.trim().length < APP_CONFIG.VALIDATION.MIN_GAME_NAME_LENGTH) {
    errors.push('Game name is required');
  }
  
  if (gameData.name && gameData.name.length > APP_CONFIG.VALIDATION.MAX_GAME_NAME_LENGTH) {
    errors.push(`Game name must be less than ${APP_CONFIG.VALIDATION.MAX_GAME_NAME_LENGTH} characters`);
  }
  
  // Check genre
  if (gameData.genre && gameData.genre.length > APP_CONFIG.VALIDATION.MAX_GENRE_LENGTH) {
    errors.push(`Genre must be less than ${APP_CONFIG.VALIDATION.MAX_GENRE_LENGTH} characters`);
  }
  
  // Check description
  if (gameData.desc && gameData.desc.length > APP_CONFIG.VALIDATION.MAX_DESC_LENGTH) {
    errors.push(`Description must be less than ${APP_CONFIG.VALIDATION.MAX_DESC_LENGTH} characters`);
  }
  
  // Check trailer URL
  if (gameData.trailer && !isValidURL(gameData.trailer)) {
    errors.push('Trailer must be a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};


// ==================== VALIDATE URL ====================
const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};


// ==================== GET NEXT AVAILABLE ID ====================
const getNextGameId = (games) => {
  if (games.length === 0) return 1000;
  
  const maxId = Math.max(...games.map(g => g.id));
  return maxId < 1000 ? 1000 : maxId + 1;
};


// Make all functions available globally
window.GameFeatures = {
  searchGames,
  filterGames,
  sortGames,
  calculateStats,
  updateGameStatus,
  updateGameRating,
  updateGameNotes,
  deleteGame,
  addNewGame,
  validateGameData,
  isValidURL,
  getNextGameId
};

/*
  ============================================
  HOW TO USE THESE FUNCTIONS:
  ============================================
  
  Import in your app:
  const { searchGames, filterGames, sortGames } = window.GameFeatures;
  
  Search games:
  const filtered = searchGames(games, 'batman');
  
  Filter by status:
  const filtered = filterGames(games, 'completed');
  
  Sort games:
  const sorted = sortGames(games, 'name');
  
  Calculate stats:
  const stats = calculateStats(games);
  
  Update status:
  const updated = updateGameStatus(games, gameId);
  
  Update rating:
  const updated = updateGameRating(games, gameId, 5);
  
  Update notes:
  const updated = updateGameNotes(games, gameId, 'Great game!');
  
  Delete game:
  const updated = deleteGame(games, gameId);
  
  Add new game:
  const newGameData = { name: 'New Game', genre: 'Action', ... };
  const updated = addNewGame(games, newGameData);
  
  Validate game data:
  const { isValid, errors } = validateGameData(gameData);
  if (!isValid) {
    console.error('Validation errors:', errors);
  }
  
  ============================================
  COMBINING FUNCTIONS:
  ============================================
  
  Apply search, filter, and sort together:
  
  let result = games;
  result = searchGames(result, searchTerm);
  result = filterGames(result, filter);
  result = sortGames(result, sortBy);
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  Add new search fields:
  - Edit searchGames() function
  - Add more checks (e.g., search by hours, tier, etc.)
  
  Add new sort options:
  - Edit sortGames() function
  - Add new case in switch statement
  
  Change validation rules:
  - Edit validateGameData() function
  - Modify error messages and conditions
  
  Add new features:
  - Create new function following same pattern
  - Add to window.GameFeatures export
  - Use in app.js
  
  ============================================
*/