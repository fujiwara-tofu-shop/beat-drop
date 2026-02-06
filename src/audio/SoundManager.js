// Chinese Synthwave SFX using Web Audio API

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Lane 0: Deep taiko-style drum
export function playDrum() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(100, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
  
  gain.gain.setValueAtTime(0.75, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
  
  // Body hit
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = 75;
  gain2.gain.setValueAtTime(0.25, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.15);
}

// Lane 1: Gong/bell hit - clear, rhythmic
export function playGong() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Main tone - clear bell
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = 587.33; // D5
  
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
  
  // Harmonic
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 880; // A5
  gain2.gain.setValueAtTime(0.15, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.25);
  
  // Click attack
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'square';
  osc3.frequency.value = 2000;
  gain3.gain.setValueAtTime(0.1, now);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  osc3.connect(gain3).connect(ctx.destination);
  osc3.start(now);
  osc3.stop(now + 0.02);
}

// Lane 2: Guzheng-style pluck (pentatonic)
export function playZheng() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Pentatonic notes - A, C, D, E, G (higher octave for clarity)
  const notes = [880, 1046.5, 1174.66, 1318.51, 1567.98];
  const freq = notes[Math.floor(Math.random() * notes.length)];
  
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = 'triangle';
  osc.frequency.value = freq;
  
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(4000, now);
  filter.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.1;
  
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc2.connect(gain2).connect(gain);
  
  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.5);
  osc2.stop(now + 0.5);
}

// Miss sound
export function playMiss() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = 120;
  
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

// Map lane index to sound
export function playLaneSound(lane) {
  switch (lane) {
    case 0: playDrum(); break;
    case 1: playGong(); break;
    case 2: playZheng(); break;
  }
}
