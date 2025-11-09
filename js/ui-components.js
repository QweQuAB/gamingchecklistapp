/*
  ============================================
  UI COMPONENTS
  ============================================
  
  This file contains reusable UI pieces that are used
  throughout the app.
  
  COMPONENTS:
  - Header (app title, dark mode toggle)
  - ProgressBar (completion tracking)
  - StatsCards (game statistics)
  - FilterButtons (status filters)
  - SearchBar (game search)
  - SortOptions (sorting controls)
  
  ============================================
*/

const { useState } = React;

// ==================== HEADER COMPONENT ====================
const Header = ({ darkMode, setDarkMode, stats }) => {
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  
  return (
    <div className={`${cardBg} rounded-xl shadow-2xl p-4 mb-4`}>
      <div className="flex justify-between items-center mb-2">
        <h1 className={`text-2xl font-bold ${textClass}`}>
          {APP_CONFIG.APP_NAME}
        </h1>
        {APP_CONFIG.FEATURES.ENABLE_DARK_MODE && (
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition-colors"
            aria-label="Toggle dark mode"
          >
            <Icon name={darkMode ? 'sun' : 'moon'} size={20} />
          </button>
        )}
      </div>
      <p className={`text-sm ${textMuted}`}>
        Tap card to expand • Tap icon to change status
      </p>
      
      {/* Progress Bar */}
      <ProgressBar stats={stats} darkMode={darkMode} textClass={textClass} textMuted={textMuted} />
    </div>
  );
};


// ==================== PROGRESS BAR COMPONENT ====================
const ProgressBar = ({ stats, darkMode, textClass, textMuted }) => {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className={textMuted}>Completion Progress</span>
        <span className={textClass}>{stats.completionPercent}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
          style={{width: `${stats.completionPercent}%`}}
        ></div>
      </div>
      <p className="text-xs mt-1 text-center" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
        {stats.completed + stats.favorite} of {stats.total} games completed
      </p>
    </div>
  );
};


// ==================== STATS CARDS COMPONENT ====================
const StatsCards = ({ stats, darkMode }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {/* Total Games */}
      <div className={`${cardBg} rounded-lg p-3 text-center shadow`}>
        <div className={`text-xl font-bold ${textClass}`}>{stats.total}</div>
        <div className={`text-xs ${textMuted}`}>Total</div>
      </div>
      
      {/* Playing */}
      <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg p-3 text-center shadow`}>
        <div className={`text-xl font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
          {stats.playing}
        </div>
        <div className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
          Playing
        </div>
      </div>
      
      {/* Completed */}
      <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg p-3 text-center shadow`}>
        <div className={`text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          {stats.completed}
        </div>
        <div className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
          Done
        </div>
      </div>
    </div>
  );
};


// ==================== FILTER BUTTONS COMPONENT ====================
const FilterButtons = ({ filter, setFilter, stats, darkMode }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  
  const filters = [
    ['all', 'All', stats.total],
    ['not_downloaded', 'Not DL', stats.not_downloaded],
    ['downloaded', 'Downloaded', stats.downloaded],
    ['playing', 'Playing', stats.playing],
    ['completed', 'Done', stats.completed],
    ['favorite', 'Fav', stats.favorite]
  ];
  
  return (
    <div className={`${cardBg} rounded-xl shadow-xl p-3 mb-4`}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-2 rounded whitespace-nowrap text-sm font-medium transition-colors ${
              filter === key 
                ? 'bg-purple-600 text-white' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    </div>
  );
};


// ==================== SEARCH BAR COMPONENT ====================
const SearchBar = ({ searchTerm, setSearchTerm, showSort, setShowSort, darkMode }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  
  if (!APP_CONFIG.FEATURES.ENABLE_SEARCH) return null;
  
  return (
    <div className={`${cardBg} rounded-xl shadow-xl p-3 mb-4`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
        {APP_CONFIG.FEATURES.ENABLE_SORTING && (
          <button
            onClick={() => setShowSort(!showSort)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            aria-label="Sort options"
          >
            <Icon name="sliders" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};


// ==================== SORT OPTIONS COMPONENT ====================
const SortOptions = ({ sortBy, setSortBy, showSort, darkMode }) => {
  if (!showSort || !APP_CONFIG.FEATURES.ENABLE_SORTING) return null;
  
  const sortOptions = [
    ['tier', 'By Tier'],
    ['name', 'By Name'],
    ['fps', 'By FPS'],
    ['rating', 'By Rating']
  ];
  
  return (
    <div className="mt-3 flex gap-2 flex-wrap animate-fadeIn">
      {sortOptions.map(([key, label]) => (
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
  );
};


// ==================== BACKUP BUTTONS COMPONENT ====================
const BackupButtons = ({ onExport, onImport, darkMode }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  
  if (!APP_CONFIG.FEATURES.ENABLE_EXPORT && !APP_CONFIG.FEATURES.ENABLE_IMPORT) {
    return null;
  }
  
  return (
    <div className={`${cardBg} rounded-xl shadow-xl p-3 mb-4 flex gap-2`}>
      {APP_CONFIG.FEATURES.ENABLE_EXPORT && (
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-lg font-medium text-sm hover:bg-green-600 transition-colors"
        >
          <Icon name="download" size={16} /> Export
        </button>
      )}
      {APP_CONFIG.FEATURES.ENABLE_IMPORT && (
        <label className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-lg font-medium text-sm cursor-pointer hover:bg-blue-600 transition-colors">
          <Icon name="upload" size={16} /> Import
          <input 
            type="file" 
            accept=".json" 
            onChange={onImport} 
            className="hidden" 
          />
        </label>
      )}
    </div>
  );
};


// ==================== EMPTY STATE COMPONENT ====================
const EmptyState = ({ darkMode, searchTerm, filter }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`${cardBg} rounded-xl shadow-xl p-8 text-center`}>
      <div className="text-6xl mb-4">🎮</div>
      <p className={`${textMuted} text-lg font-medium mb-2`}>No games found</p>
      <p className={`${textMuted} text-sm`}>
        {searchTerm 
          ? `No games match "${searchTerm}"`
          : filter !== 'all'
            ? `No games in this category`
            : 'Start by adding some games!'
        }
      </p>
      <p className={`${textMuted} text-xs mt-3`}>
        Try adjusting your search or filter
      </p>
    </div>
  );
};


// ==================== LEGEND COMPONENT ====================
const Legend = ({ darkMode }) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`${cardBg} rounded-xl shadow-xl p-4 mt-6`}>
      <h3 className={`font-bold mb-3 ${textClass}`}>How to Use</h3>
      <div className={`space-y-2 text-sm ${textMuted}`}>
        <p>• <strong>Tap card</strong> to expand details</p>
        <p>• <strong>Tap status icon</strong> to cycle statuses</p>
        {APP_CONFIG.FEATURES.ENABLE_RATINGS && <p>• <strong>Tap stars</strong> to rate games</p>}
        {APP_CONFIG.FEATURES.ENABLE_NOTES && <p>• <strong>Add notes</strong> to remember thoughts</p>}
        {(APP_CONFIG.FEATURES.ENABLE_EXPORT || APP_CONFIG.FEATURES.ENABLE_IMPORT) && 
          <p>• <strong>Export/Import</strong> to backup your data</p>
        }
      </div>
      
      <h3 className={`font-bold mt-4 mb-2 ${textClass}`}>Status Icons</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Icon name="circle" size={16} className="text-gray-400" /> 
          <span className={textMuted}>Not Downloaded</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="download" size={16} className="text-blue-500" /> 
          <span className={textMuted}>Downloaded</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="play" size={16} className="text-green-500" /> 
          <span className={textMuted}>Playing</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="check" size={16} className="text-purple-500" /> 
          <span className={textMuted}>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="star" size={16} fill="currentColor" className="text-yellow-500" /> 
          <span className={textMuted}>Favorite</span>
        </div>
      </div>
    </div>
  );
};


// ==================== FOOTER COMPONENT ====================
const Footer = ({ darkMode }) => {
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  
  return (
    <div className={`text-center text-sm ${textMuted} mt-6 mb-4`}>
      Made with ❤️ for {APP_CONFIG.APP_AUTHOR}'s Gaming Journey
      <div className="text-xs mt-1 opacity-75">
        v{APP_CONFIG.APP_VERSION}
      </div>
    </div>
  );
};


// Make all components available globally
window.UIComponents = {
  Header,
  ProgressBar,
  StatsCards,
  FilterButtons,
  SearchBar,
  SortOptions,
  BackupButtons,
  EmptyState,
  Legend,
  Footer
};

/*
  ============================================
  HOW TO USE THESE COMPONENTS:
  ============================================
  
  Import in your app:
  const { Header, StatsCards, FilterButtons } = window.UIComponents;
  
  Use in JSX:
  <Header darkMode={darkMode} setDarkMode={setDarkMode} stats={stats} />
  <StatsCards stats={stats} darkMode={darkMode} />
  <FilterButtons filter={filter} setFilter={setFilter} stats={stats} darkMode={darkMode} />
  
  ============================================
  CUSTOMIZATION:
  ============================================
  
  To modify a component:
  1. Find the component function
  2. Change the JSX/logic
  3. Save and refresh
  
  To add a new component:
  1. Create function following same pattern
  2. Add to window.UIComponents export
  3. Use in app.js
  
  ============================================
  PROPS REFERENCE:
  ============================================
  
  Header:
  - darkMode: boolean
  - setDarkMode: function
  - stats: object {total, completed, etc.}
  
  StatsCards:
  - stats: object
  - darkMode: boolean
  
  FilterButtons:
  - filter: string
  - setFilter: function
  - stats: object
  - darkMode: boolean
  
  SearchBar:
  - searchTerm: string
  - setSearchTerm: function
  - showSort: boolean
  - setShowSort: function
  - darkMode: boolean
  
  SortOptions:
  - sortBy: string
  - setSortBy: function
  - showSort: boolean
  - darkMode: boolean
  
  BackupButtons:
  - onExport: function
  - onImport: function
  - darkMode: boolean
  
  EmptyState:
  - darkMode: boolean
  - searchTerm: string
  - filter: string
  
  Legend:
  - darkMode: boolean
  
  Footer:
  - darkMode: boolean
  
  ============================================
*/