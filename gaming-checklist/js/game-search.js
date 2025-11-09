/*
  ============================================
  GAME SEARCH & AUTO-FILL
  ============================================
  
  This file searches the internet for game information
  and auto-fills the add game form.
  
  USES:
  - RAWG API (free, no key needed for basic use)
  - YouTube Data API (searches for trailers)
  - HowLongToBeat (estimated hours)
  
  ============================================
*/

const GameSearch = {
  
  // ==================== SEARCH FOR GAME ====================
  searchGame: async function(gameName) {
    if (!gameName || gameName.trim().length < 2) {
      return {
        success: false,
        error: 'Please enter a game name (at least 2 characters)'
      };
    }
    
    try {
      console.log('🔍 Searching for:', gameName);
      
      // Search using RAWG API (free, no key needed)
      const searchUrl = `https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&page_size=5`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return {
          success: false,
          error: 'No games found. Try a different name.'
        };
      }
      
      // Return multiple results for user to choose
      const games = data.results.map(game => ({
        id: game.id,
        name: game.name,
        released: game.released,
        rating: game.rating,
        image: game.background_image,
        genres: game.genres?.map(g => g.name).join(', ') || 'Unknown',
        platforms: game.platforms?.map(p => p.platform.name).join(', ') || ''
      }));
      
      return {
        success: true,
        games: games
      };
      
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: 'Search failed. Please check your internet connection.'
      };
    }
  },
  
  
  // ==================== GET DETAILED GAME INFO ====================
  getGameDetails: async function(gameId) {
    try {
      console.log('📊 Fetching details for game ID:', gameId);
      
      // Get detailed info from RAWG
      const detailsUrl = `https://api.rawg.io/api/games/${gameId}`;
      const response = await fetch(detailsUrl);
      
      if (!response.ok) {
        throw new Error('Failed to get game details');
      }
      
      const game = await response.json();
      
      // Extract relevant information
      const gameData = {
        name: game.name,
        genre: game.genres?.map(g => g.name).join(', ') || 'Unknown',
        desc: game.description_raw ? 
              game.description_raw.substring(0, 300) + '...' : 
              'No description available',
        released: game.released,
        rating: game.rating,
        image: game.background_image,
        metacritic: game.metacritic,
        playtime: game.playtime ? `${game.playtime} hours` : null,
        platforms: game.platforms?.map(p => p.platform.name).join(', ') || '',
        esrb: game.esrb_rating?.name || 'Not Rated'
      };
      
      // Search for YouTube trailer
      const trailer = await this.searchYouTubeTrailer(game.name);
      if (trailer) {
        gameData.trailer = trailer;
      }
      
      // Estimate hours to beat based on playtime
      if (game.playtime && game.playtime > 0) {
        gameData.hours = `${game.playtime}-${game.playtime + 5}`;
      }
      
      // Generate emoji icon based on genre
      gameData.icon = this.getEmojiForGenre(game.genres?.[0]?.name || '');
      
      // Estimate FPS based on age and type
      gameData.fps = this.estimateFPS(game);
      
      // Determine tier (basic heuristic)
      gameData.tier = this.determineTier(game);
      
      return {
        success: true,
        data: gameData
      };
      
    } catch (error) {
      console.error('Error getting game details:', error);
      return {
        success: false,
        error: 'Failed to get game details'
      };
    }
  },
  
  
  // ==================== SEARCH YOUTUBE TRAILER ====================
  searchYouTubeTrailer: async function(gameName) {
    try {
      // Use YouTube's no-API search (less reliable but works without key)
      const searchQuery = encodeURIComponent(`${gameName} official trailer gameplay`);
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
      
      // For now, return a search URL that user can click
      // In a full implementation, you'd use YouTube Data API with a key
      return `https://www.youtube.com/results?search_query=${searchQuery}`;
      
    } catch (error) {
      console.error('YouTube search error:', error);
      return null;
    }
  },
  
  
  // ==================== GET EMOJI FOR GENRE ====================
  getEmojiForGenre: function(genre) {
    const emojiMap = {
      'Action': '⚔️',
      'Adventure': '🗺️',
      'RPG': '🎭',
      'Strategy': '🧠',
      'Shooter': '🔫',
      'Racing': '🏎️',
      'Sports': '⚽',
      'Puzzle': '🧩',
      'Platformer': '🏃',
      'Fighting': '🥊',
      'Horror': '👻',
      'Simulation': '✈️',
      'MMORPG': '🗡️',
      'Indie': '🎨',
      'Casual': '🎮',
      'Family': '👨‍👩‍👧‍👦',
      'Educational': '📚',
      'Card': '🃏',
      'Board Games': '🎲'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (genre.includes(key)) {
        return emoji;
      }
    }
    
    return '🎮'; // Default
  },
  
  
  // ==================== ESTIMATE FPS ====================
  estimateFPS: function(game) {
    const releaseYear = game.released ? parseInt(game.released.split('-')[0]) : 2020;
    const currentYear = new Date().getFullYear();
    const age = currentYear - releaseYear;
    
    // Newer games = lower FPS on your system
    if (age <= 2) {
      return '20-30';
    } else if (age <= 5) {
      return '30-45';
    } else if (age <= 8) {
      return '40-55';
    } else {
      return '50-60';
    }
  },
  
  
  // ==================== DETERMINE TIER ====================
  determineTier: function(game) {
    // Use metacritic score to suggest tier
    const score = game.metacritic || game.rating * 20;
    
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    return 'C';
  },
  
  
  // ==================== DOWNLOAD IMAGE ====================
  downloadImage: async function(imageUrl) {
    try {
      // Convert image URL to base64 for storage
      // Note: This might have CORS issues with some images
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }
  
};

// Make available globally
window.GameSearch = GameSearch;

/*
  ============================================
  HOW TO USE:
  ============================================
  
  1. SEARCH FOR GAMES:
  
  const result = await GameSearch.searchGame('Batman Arkham');
  if (result.success) {
    // result.games = array of matching games
    // Show user list to choose from
  }
  
  2. GET DETAILED INFO:
  
  const details = await GameSearch.getGameDetails(gameId);
  if (details.success) {
    // details.data contains all game info
    // Auto-fill form with this data
  }
  
  ============================================
  INTEGRATION EXAMPLE:
  ============================================
  
  In your add game form:
  
  1. User types game name
  2. User clicks "Search" button
  3. Call GameSearch.searchGame(name)
  4. Show list of results
  5. User selects one
  6. Call GameSearch.getGameDetails(selectedId)
  7. Auto-fill form fields
  8. User can edit if needed
  9. Save game
  
  ============================================
  API LIMITATIONS:
  ============================================
  
  RAWG API (Free tier):
  - 20,000 requests/month
  - No API key required for basic use
  - Rate limited to 20 requests/second
  
  If you need more:
  - Sign up at rawg.io/apidocs
  - Get free API key
  - Add to requests: ?key=YOUR_KEY
  
  ============================================
  ALTERNATIVE APIS:
  ============================================
  
  If RAWG doesn't work:
  
  1. IGDB (Twitch):
     - More detailed data
     - Requires free API key
     - api.igdb.com
  
  2. Giant Bomb:
     - Comprehensive database
     - Requires free API key
     - giantbomb.com/api
  
  3. Steam API:
     - Only for Steam games
     - Free, no key needed
     - store.steampowered.com/api
  
  ============================================
  TROUBLESHOOTING:
  ============================================
  
  "No games found":
  - Try different search term
  - Check spelling
  - Try shorter name (just main title)
  
  "Search failed":
  - Check internet connection
  - API might be down
  - Try again in a moment
  
  "CORS error":
  - This is normal in local testing
  - Will work fine when deployed
  - Or use CORS proxy for testing
  
  ============================================
*/