// Web Audio API & HTML5 Audio Engine for Telugu Birthday Background Music & SFX

let audioCtx = null;
let isMuted = false;
let isPlayingMusic = false;
let bgAudio = null;
let musicInterval = null;

// Initialize HTML5 Audio Element for Background Music
function initBgAudio() {
  if (!bgAudio) {
    bgAudio = new Audio('./audio/telugu_birthday_song.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.65;
  }
  return bgAudio;
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// -------------------------------------------------------------
// BACKGROUND MUSIC CONTROLLER
// -------------------------------------------------------------

export function startBackgroundMusic() {
  const audio = initBgAudio();
  getAudioContext();

  if (isPlayingMusic) return;
  isPlayingMusic = true;

  // Try playing HTML5 Audio track
  audio.play().then(() => {
    updateMusicButtonState(true);
  }).catch(err => {
    console.warn("HTML5 Audio autoplay restricted, starting synth engine fallback:", err);
    startSynthFallback();
    updateMusicButtonState(true);
  });
}

export function stopBackgroundMusic() {
  isPlayingMusic = false;
  if (bgAudio) {
    bgAudio.pause();
  }
  stopSynthFallback();
  updateMusicButtonState(false);
}

export function toggleMusicState() {
  if (isPlayingMusic) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
  return isPlayingMusic;
}

function updateMusicButtonState(playing) {
  const musicBtn = document.getElementById('music-btn');
  if (!musicBtn) return;
  if (playing) {
    musicBtn.classList.add('playing');
  } else {
    musicBtn.classList.remove('playing');
  }
}

// -------------------------------------------------------------
// SYNTH FALLBACK ENGINE
// -------------------------------------------------------------
const ambientChords = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [174.61, 220.00, 261.63, 329.63], // Fmaj7
  [196.00, 246.94, 293.66, 392.00]  // G7
];
let chordIndex = 0;

function startSynthFallback() {
  chordIndex = 0;
  playNextChord();
  musicInterval = setInterval(playNextChord, 4000);
}

function stopSynthFallback() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

function playNextChord() {
  if (!isPlayingMusic || isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const currentChord = ambientChords[chordIndex];
  chordIndex = (chordIndex + 1) % ambientChords.length;

  currentChord.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 4.0);
  });
}

// -------------------------------------------------------------
// SYNTHESIZED SOUND EFFECTS (SFX)
// -------------------------------------------------------------

export function playButtonClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.09);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

export function playCountdownPop(number) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqMap = { 3: 523.25, 2: 659.25, 1: 783.99 };
  const baseFreq = freqMap[number] || 1046.50;

  // Primary tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.18);

  gain1.gain.setValueAtTime(0.28, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.18);

  // Sparkle octave harmonic
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);
  gain2.gain.setValueAtTime(0.12, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.15);
}

export function playFireworksSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Deep boom bass
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.65);

  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.65);
}

export function playChimeSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      if (isMuted || !ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    }, idx * 90);
  });
}

export function playRibbonUntie() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.45);

  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}
