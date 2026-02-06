// SFX using Web Audio API (one-shot sounds)
// Following game-audio skill: Strudel is for looping BGM, Web Audio for SFX

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Kick - low sine with pitch drop
export function playKick() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
  
  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

// Snare - noise burst
export function playSnare() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1500;
  
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
}

// Hi-hat - short noise burst
export function playHat() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000;
  
  const gain = ctx.createGain();
  gain.gain.value = 0.3;
  
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(now);
}

// Synth - bright arpeggio note
export function playSynth() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const freq = notes[Math.floor(Math.random() * notes.length)];
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = 'square';
  osc.frequency.value = freq;
  
  filter.type = 'lowpass';
  filter.frequency.value = 2500;
  
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Miss sound - low buzz
export function playMiss() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.value = 80;
  
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// Map lane index to sound
export function playLaneSound(lane) {
  switch (lane) {
    case 0: playKick(); break;
    case 1: playSnare(); break;
    case 2: playHat(); break;
    case 3: playSynth(); break;
  }
}
