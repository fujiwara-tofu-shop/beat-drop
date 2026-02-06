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
      // Chinese synthwave - dreamy, slow
      currentMusic = stack(
        // Deep sub bass - pentatonic
        note('<a1 ~ c2 ~ d2 ~ e2 ~>')
          .s('sine')
          .gain(0.2)
          .lpf(120)
          .decay(0.5)
          .sustain(0.2)
          .slow(2),
        // Warm pad - Am pentatonic chord
        note('<a2,c3,e3> <a2,d3,e3>')
          .s('triangle')
          .gain(0.08)
          .attack(0.8)
          .decay(3)
          .sustain(0.15)
          .lpf(900)
          .room(0.5)
          .slow(4),
        // Subtle arp - very quiet
        note('a4 c5 e5 a5')
          .s('sine')
          .gain(0.03)
          .decay(0.2)
          .sustain(0)
          .delay(0.3)
          .delaytime(0.5)
          .lpf(1500)
          .fast(0.5)
      ).cpm(85).play();
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
