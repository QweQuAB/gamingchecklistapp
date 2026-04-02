/**
 * config.js
 * Global configuration settings for the Gaming Checklist app.
 */

const APP_CONFIG = {
  APP_NAME: "Gaming Checklist",
  STORAGE: {
    GAMES_KEY: "gc_games",
    DARK_MODE_KEY: "gc_dark_mode",
    INSTALL_DISMISSED_KEY: "gc_install_dismissed",
    USER_SETTINGS_KEY: "gc_settings"
  },
  STATUS: {
    NOT_DOWNLOADED: "not_downloaded",
    PLAYING: "playing",
    COMPLETED: "completed"
  },
  TIERS: {
    S: { label: "Must Play" },
    A: { label: "Excellent" },
    B: { label: "Worth It" },
    C: { label: "Classics" },
    R: { label: "Racing" }
  },
  STATUS_CYCLE: ["not_downloaded", "playing", "completed"],
  DEFAULTS: {
    DARK_MODE: true
  },
  VALIDATION: {
    MAX_IMPORT_SIZE: 5242880 // 5MB
  }
};

// Export to window for global access
window.APP_CONFIG = APP_CONFIG;
window.CONFIG = APP_CONFIG;
window.GAMES = []; // Placeholder for initialization
