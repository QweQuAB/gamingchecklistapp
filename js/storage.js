/*
  ============================================
  STORAGE MANAGER
  ============================================
  
  This file handles ALL data saving and loading.
  Uses localStorage (browser's built-in storage).
  
  WHAT IT DOES:
  - Saves games to browser
  - Loads games from browser
  - Exports data to file
  - Imports data from file
  - Manages user settings
  
  ============================================
*/

const StorageManager = {
  
  // ==================== SAVE GAMES ====================
  saveGames: function(games) {
    try {
      const json = JSON.stringify(games);
      localStorage.setItem(APP_CONFIG.STORAGE.GAMES_KEY, json);
      console.log('✅ Games saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving games:', error);
      alert('Failed to save games. Storage might be full.');
      return false;
    }
  },
  
  
  // ==================== LOAD GAMES ====================
  loadGames: function() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE.GAMES_KEY);
      
      if (!saved) {
        console.log('📝 No saved games found, using initial data');
        return window.GAME_DATA.map(game => ({
          ...game,
          status: game.status || APP_CONFIG.STATUS.NOT_DOWNLOADED
        }));
      }
      
      const savedGames = JSON.parse(saved);
      const initialGames = window.GAME_DATA;
      
      // Merge saved data with initial data
      const merged = initialGames.map(game => {
        const savedGame = savedGames.find(sg => sg.id === game.id);
        return savedGame 
          ? { ...game, status: savedGame.status, rating: savedGame.rating, notes: savedGame.notes }
          : { ...game, status: game.status || APP_CONFIG.STATUS.NOT_DOWNLOADED };
      });
      
      // Add any custom games that aren't in initial data
      const customGames = savedGames.filter(sg => !initialGames.find(ig => ig.id === sg.id));
      
      console.log('✅ Games loaded successfully');
      return [...merged, ...customGames];
      
    } catch (error) {
      console.error('❌ Error loading games:', error);
      alert('Failed to load saved games. Using default data.');
      return window.GAME_DATA.map(game => ({
        ...game,
        status: game.status || APP_CONFIG.STATUS.NOT_DOWNLOADED
      }));
    }
  },
  
  
  // ==================== SAVE DARK MODE ====================
  saveDarkMode: function(isDark) {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE.DARK_MODE_KEY, JSON.stringify(isDark));
      console.log('✅ Dark mode preference saved:', isDark);
      return true;
    } catch (error) {
      console.error('❌ Error saving dark mode:', error);
      return false;
    }
  },
  
  
  // ==================== LOAD DARK MODE ====================
  loadDarkMode: function() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE.DARK_MODE_KEY);
      return saved ? JSON.parse(saved) : APP_CONFIG.DEFAULTS.DARK_MODE;
    } catch (error) {
      console.error('❌ Error loading dark mode:', error);
      return APP_CONFIG.DEFAULTS.DARK_MODE;
    }
  },
  
  
  // ==================== EXPORT TO FILE ====================
  exportToFile: function(games) {
    try {
      const dataStr = JSON.stringify(games, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `gaming-checklist-backup-${Date.now()}.json`;
      link.click();
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('✅ Data exported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      alert('Failed to export data.');
      return false;
    }
  },
  
  
  // ==================== IMPORT FROM FILE ====================
  importFromFile: function(file, callback) {
    if (!file) {
      console.error('❌ No file provided');
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file');
      return;
    }
    
    // Check file size
    if (file.size > APP_CONFIG.VALIDATION.MAX_IMPORT_SIZE) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
      try {
        const imported = JSON.parse(event.target.result);
        
        // Validate data
        if (!Array.isArray(imported)) {
          throw new Error('Invalid data format');
        }
        
        console.log('✅ Data imported successfully:', imported.length, 'games');
        callback(imported);
        
      } catch (error) {
        console.error('❌ Error importing data:', error);
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    
    reader.onerror = function() {
      console.error('❌ Error reading file');
      alert('Failed to read file.');
    };
    
    reader.readAsText(file);
  },
  
  
  // ==================== CLEAR ALL DATA ====================
  clearAllData: function() {
    if (!confirm('⚠️ This will delete ALL your data. Are you sure?')) {
      return false;
    }
    
    if (!confirm('⚠️ Last chance! This cannot be undone. Continue?')) {
      return false;
    }
    
    try {
      localStorage.removeItem(APP_CONFIG.STORAGE.GAMES_KEY);
      localStorage.removeItem(APP_CONFIG.STORAGE.DARK_MODE_KEY);
      localStorage.removeItem(APP_CONFIG.STORAGE.INSTALL_DISMISSED_KEY);
      localStorage.removeItem(APP_CONFIG.STORAGE.USER_SETTINGS_KEY);
      
      console.log('✅ All data cleared');
      alert('All data has been cleared. The page will reload.');
      window.location.reload();
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      alert('Failed to clear data.');
      return false;
    }
  },
  
  
  // ==================== GET STORAGE INFO ====================
  getStorageInfo: function() {
    try {
      // Estimate storage usage
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      
      // Convert to KB
      const sizeKB = (totalSize / 1024).toFixed(2);
      
      return {
        itemCount: localStorage.length,
        sizeKB: sizeKB,
        sizeMB: (sizeKB / 1024).toFixed(2),
        keys: Object.keys(localStorage)
      };
    } catch (error) {
      console.error('❌ Error getting storage info:', error);
      return null;
    }
  },
  
  
  // ==================== CHECK IF STORAGE AVAILABLE ====================
  isStorageAvailable: function() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('⚠️ localStorage not available:', error);
      return false;
    }
  },
  
};

// Make StorageManager available globally
window.StorageManager = StorageManager;

// Check if storage is available on load
if (!StorageManager.isStorageAvailable()) {
  alert('⚠️ Warning: Browser storage is not available. Your data will not be saved!');
}

/*
  ============================================
  HOW TO USE THIS FILE:
  ============================================
  
  SAVE GAMES:
  StorageManager.saveGames(gamesArray);
  
  LOAD GAMES:
  const games = StorageManager.loadGames();
  
  SAVE DARK MODE:
  StorageManager.saveDarkMode(true);
  
  LOAD DARK MODE:
  const isDark = StorageManager.loadDarkMode();
  
  EXPORT DATA:
  StorageManager.exportToFile(gamesArray);
  
  IMPORT DATA:
  StorageManager.importFromFile(file, (importedGames) => {
    // Do something with imported games
    setGames(importedGames);
  });
  
  CLEAR ALL DATA:
  StorageManager.clearAllData();
  
  CHECK STORAGE SIZE:
  const info = StorageManager.getStorageInfo();
  console.log('Storage used:', info.sizeMB, 'MB');
  
  ============================================
  WHEN DATA IS SAVED:
  ============================================
  
  Data is automatically saved when you:
  - Change game status
  - Add notes
  - Rate a game
  - Add new game
  - Delete a game
  - Toggle dark mode
  
  The app.js file calls these functions automatically.
  
  ============================================
  TROUBLESHOOTING:
  ============================================
  
  DATA NOT SAVING:
  1. Check if storage is available:
     StorageManager.isStorageAvailable()
  2. Check browser's storage quota
  3. Try clearing browser cache
  4. Check for errors in console
  
  DATA LOST AFTER CLOSING:
  1. Make sure you're on same domain
  2. Don't use incognito/private mode
  3. Check browser settings allow storage
  
  IMPORT NOT WORKING:
  1. Make sure file is .json format
  2. Check file size (max 5MB)
  3. Verify file was exported from this app
  
  ============================================
  STORAGE LIMITS:
  ============================================
  
  - localStorage typically has 5-10MB limit
  - This app should use less than 1MB
  - You can store thousands of games
  - Export regularly as backup
  
  ============================================
  PRIVACY NOTE:
  ============================================
  
  All data is stored LOCALLY in your browser.
  - No data sent to servers
  - No tracking
  - No analytics
  - Your data stays on your device
  
  ============================================
*/