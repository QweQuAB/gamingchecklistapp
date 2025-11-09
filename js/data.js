/*
  ============================================
  GAME DATA FILE
  ============================================
  
  This file contains ALL your games.
  
  TO ADD A NEW GAME:
  1. Copy an existing game object
  2. Change the values
  3. Make sure id is unique
  4. Add to the appropriate tier section
  
  TO REMOVE A GAME:
  1. Delete or comment out the game object
  
  ============================================
*/

const INITIAL_GAMES = [
  
  // ==================== TIER S - MUST PLAY ====================
  {
    id: 1,
    name: "Batman: Arkham City",
    genre: "Action-Adventure",
    fps: "45-60",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=9pnK8akbd2M",
    desc: "Become the Dark Knight in an open-world Gotham prison.",
    hours: "12-15",
    icon: "🦇"
  },
  {
    id: 2,
    name: "Deus Ex: Human Revolution",
    genre: "RPG/Stealth",
    fps: "50-60",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=Kq5KWLqUewc",
    desc: "Cyberpunk RPG where your choices matter.",
    hours: "20-25",
    icon: "🤖"
  },
  {
    id: 3,
    name: "The Witcher 2",
    genre: "Fantasy RPG",
    fps: "40-50",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=YJ_KFwNLpl0",
    desc: "Hunt monsters as Geralt in this dark fantasy.",
    hours: "25-30",
    icon: "⚔️"
  },
  {
    id: 4,
    name: "Spec Ops: The Line",
    genre: "Third-Person Shooter",
    fps: "50-60",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=3uUsdBfG6o0",
    desc: "Military shooter exploring war's psychological horrors.",
    hours: "6-8",
    icon: "🎖️"
  },
  {
    id: 5,
    name: "Metro: Last Light Redux",
    genre: "FPS/Horror",
    fps: "35-45",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=8jcIYP8LpxA",
    desc: "Survive post-apocalyptic Moscow metro tunnels.",
    hours: "10-12",
    icon: "🚇"
  },
  {
    id: 6,
    name: "Dishonored",
    genre: "Stealth/Action",
    fps: "50-60",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=E1HlYTukh9A",
    desc: "Supernatural assassin with choice-based gameplay.",
    hours: "12-15",
    icon: "🗡️"
  },
  {
    id: 7,
    name: "Tomb Raider (2013)",
    genre: "Action-Adventure",
    fps: "45-55",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=xCe8-1dbXZc",
    desc: "Lara Croft's origin story on a dangerous island.",
    hours: "11-14",
    icon: "🏹"
  },
  {
    id: 43,
    name: "Mass Effect (Legendary)",
    genre: "Sci-Fi RPG",
    fps: "40-50",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=n8i53TtQ6IQ",
    desc: "Command Shepard and save the galaxy.",
    hours: "17-20",
    icon: "🚀"
  },
  {
    id: 44,
    name: "Mass Effect 2 (Legendary)",
    genre: "Sci-Fi RPG",
    fps: "45-55",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=lx9sPQpjgjU",
    desc: "Assemble a team for a suicide mission.",
    hours: "24-30",
    icon: "🚀"
  },
  {
    id: 45,
    name: "Mass Effect 3 (Legendary)",
    genre: "Sci-Fi RPG",
    fps: "40-50",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=eBktyyaV9LY",
    desc: "Final battle against the Reapers.",
    hours: "24-30",
    icon: "🚀"
  },
  
  
  // ==================== TIER A - EXCELLENT ====================
  {
    id: 8,
    name: "Batman: Arkham Knight",
    genre: "Action-Adventure",
    fps: "25-35",
    tier: "A",
    priority: "MEDIUM-HIGH",
    trailer: "https://www.youtube.com/watch?v=wsf78BS9VE0",
    desc: "Epic conclusion with the Batmobile.",
    hours: "15-18",
    icon: "🦇"
  },
  {
    id: 11,
    name: "Far Cry 3",
    genre: "FPS/Open World",
    fps: "40-50",
    tier: "A",
    priority: "MEDIUM-HIGH",
    trailer: "https://www.youtube.com/watch?v=ybdiu8iGsZg",
    desc: "Survive tropical island with insane Vaas.",
    hours: "15-20",
    icon: "🏝️"
  },
  {
    id: 20,
    name: "Doom (2016)",
    genre: "FPS",
    fps: "45-55",
    tier: "A",
    priority: "MEDIUM-HIGH",
    trailer: "https://www.youtube.com/watch?v=NteAPGprDJk",
    desc: "Rip and tear through demons.",
    hours: "11-13",
    icon: "😈"
  },
  {
    id: 46,
    name: "Warhammer 40K: Space Marine",
    genre: "Third-Person Action",
    fps: "50-60",
    tier: "A",
    priority: "MEDIUM-HIGH",
    trailer: "https://www.youtube.com/watch?v=nb50aAFiOpM",
    desc: "Battle Orks as an Ultramarine.",
    hours: "7-9",
    icon: "⚔️"
  },
  {
    id: 47,
    name: "Hades II",
    genre: "Roguelike",
    fps: "45-55",
    tier: "A",
    priority: "MEDIUM-HIGH",
    trailer: "https://www.youtube.com/watch?v=CmxOutSzAAA",
    desc: "Fight through Underworld as Melinoë.",
    hours: "20-30",
    icon: "🔱"
  },
  
  
  // ==================== TIER C - CLASSICS ====================
  {
    id: 31,
    name: "Sleeping Dogs",
    genre: "Open World Action",
    fps: "40-50",
    tier: "C",
    priority: "LOW-MEDIUM",
    status: "completed",  // Pre-set as completed
    trailer: "https://www.youtube.com/watch?v=virg-5zeC0M",
    desc: "Undercover in Hong Kong triads.",
    hours: "15-20",
    icon: "🐉"
  },
  {
    id: 32,
    name: "Max Payne 3",
    genre: "Third-Person Shooter",
    fps: "40-50",
    tier: "C",
    priority: "LOW-MEDIUM",
    trailer: "https://www.youtube.com/watch?v=5MqFhlyGg1U",
    desc: "Max's final chapter in São Paulo.",
    hours: "8-10",
    icon: "🔫"
  },
  
  
  // ==================== RACING ====================
  {
    id: 39,
    name: "NFS: Hot Pursuit Remastered",
    genre: "Racing",
    fps: "50-60",
    tier: "R",
    priority: "OPTIONAL",
    trailer: "https://www.youtube.com/watch?v=qLRy0DjT9J4",
    desc: "High-speed police chases.",
    hours: "8-12",
    icon: "🏎️"
  },
  {
    id: 40,
    name: "GRID 2",
    genre: "Racing",
    fps: "50-60",
    tier: "R",
    priority: "OPTIONAL",
    trailer: "https://www.youtube.com/watch?v=KsI1NV6hoDk",
    desc: "Arcade-sim racing balance.",
    hours: "10-15",
    icon: "🏁"
  },
  {
    id: 48,
    name: "The Crew",
    genre: "Racing",
    fps: "35-45",
    tier: "R",
    priority: "OPTIONAL",
    trailer: "https://www.youtube.com/watch?v=k9TcSHzEsqQ",
    desc: "Drive across entire USA.",
    hours: "20-30",
    icon: "🗺️"
  },

];

// Make data available globally
window.GAME_DATA = INITIAL_GAMES;

/*
  ============================================
  GAME OBJECT STRUCTURE:
  ============================================
  
  {
    id: 1,                              // REQUIRED - Unique number
    name: "Game Name",                  // REQUIRED - String
    genre: "Genre",                     // REQUIRED - String
    fps: "30-60",                       // REQUIRED - String (expected FPS range)
    tier: "S",                          // REQUIRED - S, A, B, C, or R
    priority: "HIGH",                   // REQUIRED - HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, OPTIONAL
    trailer: "https://youtube.com/...", // OPTIONAL - YouTube URL
    desc: "Description",                // OPTIONAL - Short description
    hours: "10-15",                     // OPTIONAL - Time to complete
    icon: "🎮",                         // OPTIONAL - Emoji icon
    status: "completed"                 // OPTIONAL - Pre-set status (usually left blank)
  }
  
  ============================================
  HOW TO ADD A NEW GAME:
  ============================================
  
  1. Find the tier section where you want to add it
  2. Copy an existing game object
  3. Paste it at the end of that section
  4. Change all the values:
     - id: Use next available number (e.g., 49, 50, 51...)
     - name: Full game name
     - genre: Game genre
     - fps: Expected FPS on your system
     - tier: S (must play), A (excellent), B (worth it), C (classics), R (racing)
     - priority: How important to play
     - trailer: YouTube trailer URL (optional)
     - desc: Short 1-2 sentence description (optional)
     - hours: How long to beat (optional)
     - icon: Emoji that represents the game (optional)
  5. Don't forget the comma after the closing }
  
  EXAMPLE - Adding GTA VI:
  
  {
    id: 49,
    name: "Grand Theft Auto VI",
    genre: "Open World Action",
    fps: "30-40",
    tier: "S",
    priority: "HIGH",
    trailer: "https://www.youtube.com/watch?v=example",
    desc: "Return to Vice City in the next GTA.",
    hours: "40-60",
    icon: "🚗"
  },
  
  ============================================
  HOW TO REMOVE A GAME:
  ============================================
  
  Option 1: Delete the entire game object
  - Find the game
  - Delete from { to }, including the comma
  
  Option 2: Comment it out (keeps it for later)
  - Add // before each line
  - Or wrap in /* ... */
  
  Example:
  /*
  {
    id: 32,
    name: "Max Payne 3",
    ...
  },
  */
  
  ============================================
  TIER GUIDELINES:
  ============================================
  
  S TIER - Must Play
  - Essential games
  - Everyone should play these
  - High quality, memorable experiences
  
  A TIER - Excellent
  - Outstanding games
  - Highly recommended
  - Great quality
  
  B TIER - Worth It
  - Good games
  - Worth your time
  - Solid experiences
  
  C TIER - Classics
  - Older games
  - Still enjoyable
  - Maybe dated but good
  
  R TIER - Racing
  - Racing games only
  - Any quality level
  
  ============================================
  TIPS:
  ============================================
  
  - Keep id numbers unique (no duplicates!)
  - Use consistent naming (full official names)
  - Be honest with FPS estimates for your system
  - Keep descriptions short (1-2 sentences)
  - Use emojis that make sense for the game
  - Test after adding to make sure no syntax errors
  
  ============================================
  FINDING INFORMATION:
  ============================================
  
  Trailers: Search YouTube for "game name trailer"
  Hours to beat: Check howlongtobeat.com
  Genre: Check Steam or game's official site
  Icon emoji: Pick one that represents the game theme
  
  ============================================
*/