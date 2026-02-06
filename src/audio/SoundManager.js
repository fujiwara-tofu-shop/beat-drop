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
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
  
  gain.gain.setValueAtTime(0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
  
  // Add a bit of body
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = 80;
  gain2.gain.setValueAtTime(0.3, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.2);
}

// Lane 1: Shimmery cymbal/gong
export function playCymbal() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Metallic shimmer using multiple detuned oscillators
  const freqs = [523, 587, 659, 784];
  
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.value = freq * (1 + Math.random() * 0.02);
    
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.01);
    osc.stop(now + 0.5);
  });
}

// Lane 2: Guzheng-style pluck (pentatonic)
export function playZheng() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Pentatonic notes - A, C, D, E, G
  const notes = [440, 523.25, 587.33, 659.25, 783.99];
  const freq = notes[Math.floor(Math.random() * notes.length)];
  
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = 'triangle';
  osc.frequency.value = freq;
  
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2; // Octave harmonic
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.3);
  
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.15;
  
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc2.connect(gain2).connect(gain);
  
  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.6);
  osc2.stop(now + 0.6);
}

// Miss sound - soft
export function playMiss() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = 150;
  
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// Map lane index to sound
export function playLaneSound(lane) {
  switch (lane) {
    case 0: playDrum(); break;
    case 1: playCymbal(); break;
    case 2: playZheng(); break;
  }
}
