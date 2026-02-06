// Game dimensions (mobile-first portrait)
export const GAME_WIDTH = 540;
export const GAME_HEIGHT = 960;

// Lanes - 3
export const LANE_COUNT = 3;
export const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
export const LANE_COLORS = ['#ff6b9d', '#00d4aa', '#ffd93d'];
export const LANE_NAMES = ['鼓', '鑼', '筝']; // Drum, Gong, Guzheng
export const LANE_NAMES_EN = ['DRUM', 'GONG', 'ZHENG'];

// Hit zone
export const HIT_ZONE_Y = GAME_HEIGHT - 180;
export const HIT_ZONE_HEIGHT = 100;
export const NOTE_RADIUS = 40;

// Timing windows
export const TIMING = {
  PERFECT: 60,
  GREAT: 110,
  GOOD: 160,
  MISS: 220
};

// Scoring
export const SCORE = {
  PERFECT: 100,
  GREAT: 75,
  GOOD: 50,
  MISS: 0
};

export const COMBO_MULTIPLIER = 0.1;

// Note spawning - bit faster
export const NOTE_SPEED = 320;
export const SPAWN_Y = -60;

// BPM - faster
export const BPM = 100;
export const BEAT_MS = 60000 / BPM;

// Game duration
export const GAME_DURATION = 60;

// Colors - Chinese synthwave palette
export const COLORS = {
  BG_TOP: 0x1a0a1e,
  BG_BOTTOM: 0x0a1a2e,
  HIT_ZONE: 0x2a1a3e,
  HIT_ZONE_GLOW: 0xff6b9d,
  TEXT: 0xffd93d,
  COMBO: 0x00d4aa,
  PERFECT: 0xff6b9d,
  GREAT: 0x00d4aa,
  GOOD: 0xffd93d,
  MISS: 0x666666
};

export const FONT_FAMILY = 'Georgia, serif';
