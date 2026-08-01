// Main Application Entry Point

import { initBackgroundParticles } from './canvas/particles.js';
import { initFireworksCanvas, triggerFireworksShow } from './canvas/fireworks.js';
import { initCursorTrail } from './canvas/cursor.js';
import { toggleMusicState, playButtonClick } from './audio.js';
import { runLoadingSequence, goToScreen, state, updatePersonalizedNames } from './screens.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Visual Effects & Canvas Engines
  initBackgroundParticles();
  initFireworksCanvas();
  initCursorTrail();

  // 2. Audio Control Button Listener
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      toggleMusicState();
    });
  }

  // 3. Screen 2: Name Input Submission
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  
  if (nameForm) {
    nameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredName = nameInput.value.trim();
      state.userName = enteredName || 'Akka';
      updatePersonalizedNames();
      goToScreen('screen-welcome');
    });
  }

  // 4. Navigation Buttons Binding
  bindNavigation('welcome-next-btn', 'screen-countdown');
  bindNavigation('fireworks-next-btn', 'screen-balloons');
  bindNavigation('balloons-next-btn', 'screen-letter');
  bindNavigation('letter-next-btn', 'screen-gallery');
  bindNavigation('gallery-next-btn', 'screen-gift');
  bindNavigation('gift-next-btn', 'screen-final');

  // Replay & Extra Fireworks Buttons
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      goToScreen('screen-welcome');
    });
  }

  const megaFireworksBtn = document.getElementById('fireworks-burst-btn');
  if (megaFireworksBtn) {
    megaFireworksBtn.addEventListener('click', () => {
      playButtonClick();
      triggerFireworksShow(7500);
    });
  }

  // 5. Start Initial Loading Sequence
  runLoadingSequence();
});

function bindNavigation(buttonId, targetScreenId) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener('click', () => {
      goToScreen(targetScreenId);
    });
  }
}
