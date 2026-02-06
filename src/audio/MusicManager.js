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
      // Chinese synthwave - driving but ambient
      currentMusic = stack(
        // Sub bass pulse
        note('<a1 ~ a1 ~> <a1 ~ c2 ~>')
          .s('sine')
          .gain(0.22)
          .lpf(130)
          .decay(0.4)
          .sustain(0.15),
        // Warm pad
        note('<a2,c3,e3>')
          .s('triangle')
          .gain(0.06)
          .attack(0.6)
          .decay(2)
          .sustain(0.1)
          .lpf(800)
          .room(0.4)
          .slow(2),
        // Gentle arp texture
        note('a3 c4 e4 a4')
          .s('sine')
          .gain(0.025)
          .decay(0.15)
          .sustain(0)
          .delay(0.25)
          .delaytime(0.3)
          .lpf(1200)
      ).cpm(100).play();
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
        // Ethereal pad
        note('<a2,c3,e3,a3>')
          .s('sine')
          .gain(0.1)
          .attack(1.5)
          .decay(4)
          .sustain(0.2)
          .lpf(1000)
          .room(0.6)
          .slow(4),
        // Gentle shimmer
        note('~ a4 ~ e4 ~ c5 ~ ~')
          .s('triangle')
          .gain(0.04)
          .decay(0.3)
          .sustain(0)
          .delay(0.4)
          .delaytime(0.6)
          .lpf(2000)
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
