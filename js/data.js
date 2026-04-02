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
    icon: "batman",
    favorite: false
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
    icon: "robot",
    favorite: false
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
    icon: "sword",
    favorite: false
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
    icon: "medal",
    favorite: false
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
    icon: "subway",
    favorite: false
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
    icon: "dagger",
    favorite: false
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
    icon: "bow",
    favorite: false
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
    icon: "rocket",
    favorite: false
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
    icon: "rocket",
    favorite: false
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
    icon: "rocket",
    favorite: false
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
    icon: "batman",
    favorite: false
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
    icon: "island",
    favorite: false
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
    icon: "demon",
    favorite: false
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
    icon: "sword",
    favorite: false
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
    icon: "trident",
    favorite: false
  },
  
  
  // ==================== TIER C - CLASSICS ====================
  {
    id: 31,
    name: "Sleeping Dogs",
    genre: "Open World Action",
    fps: "40-50",
    tier: "C",
    priority: "LOW-MEDIUM",
    status: "completed",
    trailer: "https://www.youtube.com/watch?v=virg-5zeC0M",
    desc: "Undercover in Hong Kong triads.",
    hours: "15-20",
    icon: "dragon",
    favorite: false
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
    icon: "gun",
    favorite: false
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
    icon: "car",
    favorite: false
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
    icon: "finish",
    favorite: false
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
    icon: "map",
    favorite: false
  },

];

// Make data available globally
window.GAME_DATA = INITIAL_GAMES;
window.GAMES = INITIAL_GAMES;
window.DATA_GAMES = INITIAL_GAMES;
