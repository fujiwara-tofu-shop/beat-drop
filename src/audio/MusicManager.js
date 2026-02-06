import { initStrudel, hush, stack, note, s } from '@strudel/web';

let initialized = false;
let currentMusic = null;

export function initMusic() {
  if (initialized) return;
  try {
    initStrudel();
    initialized = true;
    console.log('[Music] Strudel initialized');
  } catch (e) {
    console.warn('[Music] Init failed:', e);
  }
}

export function startGameplayBGM() {
  if (!initialized) initMusic();
  stopMusic();
  
  setTimeout(() => {
    try {
      // Subtle backing beat - players add the main hits
      currentMusic = stack(
        // Sub bass pulse
        note('<c1 c1 c1 g0>')
          .s('sine')
          .gain(0.25)
          .lpf(150)
          .decay(0.3)
          .sustain(0.1),
        // Very quiet pad
        note('<c3,e3,g3>')
          .s('triangle')
          .gain(0.06)
          .attack(0.5)
          .decay(2)
          .sustain(0.1)
          .lpf(800)
          .slow(4)
      ).cpm(120).play();
    } catch (e) {
      console.warn('[Music] BGM error:', e);
    }
  }, 100);
}

export function startMenuBGM() {
  if (!initialized) initMusic();
  stopMusic();
  
  setTimeout(() => {
    try {
      currentMusic = stack(
        note('<c3,e3,g3> <a2,c3,e3>')
          .s('sine')
          .gain(0.08)
          .attack(0.8)
          .decay(2)
          .sustain(0.2)
          .lpf(1200)
          .room(0.5)
          .slow(2)
      ).cpm(60).play();
    } catch (e) {
      console.warn('[Music] Menu BGM error:', e);
    }
  }, 100);
}

export function stopMusic() {
  try {
    hush();
  } catch (e) { /* noop */ }
  currentMusic = null;
}
