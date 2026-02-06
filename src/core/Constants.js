// Game dimensions (mobile-first portrait)
export const GAME_WIDTH = 540;
export const GAME_HEIGHT = 960;

// Lanes
export const LANE_COUNT = 4;
export const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
export const LANE_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7'];
export const LANE_NAMES = ['KICK', 'SNARE', 'HAT', 'SYNTH'];

// Hit zone
export const HIT_ZONE_Y = GAME_HEIGHT - 150;
export const HIT_ZONE_HEIGHT = 80;
export const NOTE_RADIUS = 35;

// Timing windows (in ms)
export const TIMING = {
  PERFECT: 50,
  GREAT: 100,
  GOOD: 150,
  MISS: 200
};

// Scoring
export const SCORE = {
  PERFECT: 100,
  GREAT: 75,
  GOOD: 50,
  MISS: 0
};

export const COMBO_MULTIPLIER = 0.1; // 10% bonus per combo

// Note spawning
export const NOTE_SPEED = 400; // pixels per second
export const SPAWN_Y = -50;

// BPM and beat timing
export const BPM = 120;
export const BEAT_MS = 60000 / BPM;

// Colors
export const COLORS = {
  BG: 0x0a0a0f,
  HIT_ZONE: 0x1a1a2e,
  HIT_ZONE_GLOW: 0x3a3a5e,
  TEXT: 0xffffff,
  COMBO: 0xffcc00,
  PERFECT: 0x00ff88,
  GREAT: 0x44ff44,
  GOOD: 0xffff44,
  MISS: 0xff4444
};

// UI
export const FONT_FAMILY = 'Arial Black, Arial, sans-serif';
