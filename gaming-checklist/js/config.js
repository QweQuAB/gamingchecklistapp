/*
  ============================================
  CONFIGURATION FILE
  ============================================
  
  This file contains all app settings and constants.
  Change values here to customize the app behavior.
  
  ============================================
*/

const CONFIG = {
  
  // ==================== APP INFO ====================
  APP_NAME: "Q's Gaming Checklist",
  APP_VERSION: "1.0.0",
  APP_AUTHOR: "Q",
  
  
  // ==================== STORAGE KEYS ====================
  STORAGE: {
    GAMES_KEY: 'gameChecklistData',      // Where games are saved in localStorage
    DARK_MODE_KEY: 'darkMode',           // Dark mode preference
    INSTALL_DISMISSED_KEY: 'installPromptDismissed',  // Install prompt status
    USER_SETTINGS_KEY: 'userSettings'    // User preferences
  },
  
  
  // ==================== GAME STATUS ====================
  STATUS: {
    NOT_DOWNLOADED: 'not_downloaded',
    DOWNLOADED: 'downloaded',
    PLAYING: 'playing',
    COMPLETED: 'completed',
    FAVORITE: 'favorite'
  },
  
  // Status cycle order (what happens when you click the status icon)
  STATUS_CYCLE: [
    'not_downloaded',
    'downloaded', 
    'playing',
    'completed',
    'favorite'
  ],
  
  
  // ==================== GAME TIERS ====================
  TIERS: {
    S: { 
      label: 'MUST PLAY', 
      color: 'bg-red-500',
      description: 'Essential games you must play'
    },
    A: { 
      label: 'EXCELLENT', 
      color: 'bg-orange-500',
      description: 'Outstanding games highly recommended'
    },
    B: { 
      label: 'WORTH IT', 
      color: 'bg-yellow-500',
      description: 'Good games worth your time'
    },
    C: { 
      label: 'CLASSICS', 
      color: 'bg-green-500',
      description: 'Older but still enjoyable games'
    },
    R: { 
      label: 'RACING', 
      color: 'bg-blue-500',
      description: 'Racing games'
    }
  },
  
  
  // ==================== UI SETTINGS ====================
  UI: {
    // Install prompt delay (milliseconds)
    INSTALL_PROMPT_DELAY: 3000,  // Show after 3 seconds
    
    // Don't show install prompt again for X days
    INSTALL_PROMPT_COOLDOWN: 7,  // 7 days
    
    // Loading screen minimum display time (milliseconds)
    LOADING_MIN_TIME: 1500,  // 1.5 seconds
    
    // Animation durations
    FADE_DURATION: 300,      // 0.3 seconds
    SLIDE_DURATION: 300,     // 0.3 seconds
    
    // Max games to show before requiring search
    MAX_GAMES_WITHOUT_SEARCH: 1000,
  },
  
  
  // ==================== THEME COLORS ====================
  THEME: {
    LIGHT: {
      primary: '#7c3aed',       // Purple
      secondary: '#ec4899',     // Pink
      background: '#ffffff',
      text: '#1f2937',
      accent: '#10b981'
    },
    DARK: {
      primary: '#a78bfa',       // Light purple
      secondary: '#f472b6',     // Light pink  
      background: '#1f2937',
      text: '#f9fafb',
      accent: '#34d399'
    }
  },
  
  
  // ==================== EXTERNAL LINKS ====================
  LINKS: {
    // YouTube search for trailers
    YOUTUBE_SEARCH: 'https://www.youtube.com/results?search_query=',
    
    // Gameranx "Before You Buy" search
    GAMERANX_SEARCH: 'https://www.youtube.com/results?search_query=gameranx+{GAME}+before+you+buy',
    
    // How Long To Beat (for game length)
    HLTB: 'https://howlongtobeat.com/?q=',
    
    // Steam store
    STEAM: 'https://store.steampowered.com/search/?term=',
  },
  
  
  // ==================== FEATURES ====================
  FEATURES: {
    // Enable/disable features
    ENABLE_DARK_MODE: true,
    ENABLE_SEARCH: true,
    ENABLE_FILTERS: true,
    ENABLE_SORTING: true,
    ENABLE_RATINGS: true,
    ENABLE_NOTES: true,
    ENABLE_EXPORT: true,
    ENABLE_IMPORT: true,
    ENABLE_ADD_GAME: true,
    ENABLE_DELETE_GAME: true,
    ENABLE_TRAILERS: true,
    ENABLE_GAMERANX: true,
    
    // Online features (require internet)
    ENABLE_ONLINE_FEATURES: true,
  },
  
  
  // ==================== VALIDATION ====================
  VALIDATION: {
    // Max lengths for user input
    MAX_GAME_NAME_LENGTH: 100,
    MAX_GENRE_LENGTH: 50,
    MAX_NOTES_LENGTH: 1000,
    MAX_DESC_LENGTH: 500,
    
    // Min lengths
    MIN_GAME_NAME_LENGTH: 1,
    
    // Allowed file types for import
    ALLOWED_IMPORT_TYPES: ['.json'],
    
    // Max file size for import (bytes)
    MAX_IMPORT_SIZE: 5 * 1024 * 1024,  // 5MB
  },
  
  
  // ==================== DEFAULTS ====================
  DEFAULTS: {
    // Default values for new games
    NEW_GAME: {
      tier: 'C',
      priority: 'MEDIUM',
      status: 'not_downloaded',
      icon: '🎮',
      rating: 0,
      notes: ''
    },
    
    // Default sort option
    SORT_BY: 'tier',
    
    // Default filter
    FILTER: 'all',
    
    // Default dark mode
    DARK_MODE: false,
  },
  
  
  // ==================== PWA SETTINGS ====================
  PWA: {
    // Service worker cache name
    CACHE_NAME: 'gaming-checklist-v1',
    
    // Update check interval (milliseconds)
    UPDATE_CHECK_INTERVAL: 3600000,  // 1 hour
    
    // Offline message
    OFFLINE_MESSAGE: "You're offline - Changes will sync when back online",
  },
  
};

// Make CONFIG available globally
window.APP_CONFIG = CONFIG;

/*
  ============================================
  HOW TO USE THIS FILE:
  ============================================
  
  Access settings anywhere in your code:
  
  Example 1: Get app name
  const appName = APP_CONFIG.APP_NAME;
  
  Example 2: Get storage key
  const gamesKey = APP_CONFIG.STORAGE.GAMES_KEY;
  
  Example 3: Check if feature is enabled
  if (APP_CONFIG.FEATURES.ENABLE_DARK_MODE) {
    // Show dark mode toggle
  }
  
  Example 4: Get theme color
  const bgColor = APP_CONFIG.THEME.LIGHT.background;
  
  ============================================
  CUSTOMIZATION GUIDE:
  ============================================
  
  CHANGE APP NAME:
  - Edit APP_NAME value
  
  DISABLE A FEATURE:
  - Set FEATURES.ENABLE_XXX to false
  - Example: ENABLE_RATINGS: false
  
  CHANGE COLORS:
  - Edit THEME.LIGHT or THEME.DARK values
  - Use hex color codes (#rrggbb)
  
  CHANGE TIERS:
  - Edit TIERS object
  - Add new tiers or modify existing ones
  
  ADD NEW SETTING:
  - Add it to the appropriate section
  - Use UPPERCASE_WITH_UNDERSCORES for keys
  - Add comment explaining what it does
  
  ============================================
  IMPORTANT NOTES:
  ============================================
  
  - Don't delete existing keys (other files depend on them)
  - Always test after making changes
  - Keep values in correct format (strings, numbers, booleans)
  - Add comments for any new settings you add
  
  ============================================
*/