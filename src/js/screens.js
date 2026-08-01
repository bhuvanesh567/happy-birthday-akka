// Master Screen Manager & Cinematic GSAP Animation Controller

import gsap from 'gsap';
import { playButtonClick, playCountdownPop, playChimeSound, playRibbonUntie, startBackgroundMusic } from './audio.js';
import { triggerFireworksShow, triggerConfettiBurst } from './canvas/fireworks.js';
import { renderGallery } from './gallery.js';

export const state = {
  userName: 'Akka',
  currentScreenIndex: 0,
  balloonsPopped: 0
};

const screens = [
  'screen-loading',
  'screen-name',
  'screen-welcome',
  'screen-countdown',
  'screen-fireworks',
  'screen-balloons',
  'screen-letter',
  'screen-gallery',
  'screen-gift',
  'screen-final'
];

export function goToScreen(screenId) {
  playButtonClick();
  
  const currentActive = document.querySelector('.screen.active');
  const targetScreen = document.getElementById(screenId);

  if (!targetScreen || currentActive === targetScreen) return;

  // GSAP Exit & Entrance Timeline
  const tl = gsap.timeline({
    onComplete: () => {
      state.currentScreenIndex = screens.indexOf(screenId);
      onScreenEnter(screenId);
    }
  });

  if (currentActive) {
    tl.to(currentActive, {
      opacity: 0,
      scale: 0.94,
      y: -20,
      filter: 'blur(6px)',
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        currentActive.classList.remove('active');
      }
    });
  }

  tl.set(targetScreen, {
    display: 'flex',
    opacity: 0,
    scale: 0.92,
    y: 30,
    filter: 'blur(10px)'
  });

  tl.to(targetScreen, {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.75,
    ease: 'power4.out',
    onStart: () => {
      targetScreen.classList.add('active');
    }
  });

  // Stagger child elements inside target screen card
  const card = targetScreen.querySelector('.glass-card, .countdown-wrapper, .gallery-container');
  if (card) {
    const animatableElements = card.querySelectorAll(
      '.golden-tag, .luxury-badge, .screen-title, .welcome-heading, .screen-subtitle, .welcome-quote, .input-wrapper, .luxury-btn, .section-title, .section-desc, .final-heading, .final-poem, .final-signature'
    );
    if (animatableElements.length > 0) {
      tl.from(animatableElements, {
        y: 25,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out'
      }, '-=0.5');
    }
  }
}

function onScreenEnter(screenId) {
  switch (screenId) {
    case 'screen-welcome':
      updatePersonalizedNames();
      break;
    case 'screen-countdown':
      startCountdownSequence();
      break;
    case 'screen-fireworks':
      updatePersonalizedNames();
      triggerFireworksShow(6500);
      break;
    case 'screen-balloons':
      spawnFloatingBalloons();
      break;
    case 'screen-letter':
      startLetterTypewriter();
      break;
    case 'screen-gallery':
      renderGallery();
      break;
    case 'screen-gift':
      resetGiftBox();
      break;
    case 'screen-final':
      triggerFireworksShow(8500);
      break;
  }
}

export function updatePersonalizedNames() {
  const elements = document.querySelectorAll('.personalized-name');
  elements.forEach(el => {
    el.innerText = state.userName || 'Akka';
  });
}

// -------------------------------------------------------------
// SCREEN 1: LOADING SCREEN
// -------------------------------------------------------------
export function runLoadingSequence() {
  const percentEl = document.getElementById('loading-percent');
  const statusEl = document.getElementById('loading-status');
  const circleEl = document.getElementById('loading-circle');

  const statuses = [
    { at: 0, text: "Preparing your birthday surprise..." },
    { at: 25, text: "Loading Precious Memories..." },
    { at: 55, text: "Loading Happiness & Smiles..." },
    { at: 80, text: "Loading Infinite Love..." },
    { at: 100, text: "Surprise Ready!" }
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += 1;
    if (percentEl) percentEl.innerText = `${progress}%`;

    if (circleEl) {
      // 2 * PI * r = 2 * PI * 60 = 377
      const offset = 377 - (377 * progress) / 100;
      circleEl.style.strokeDashoffset = offset;
    }

    const matchedStatus = statuses.slice().reverse().find(s => progress >= s.at);
    if (matchedStatus && statusEl && statusEl.innerText !== matchedStatus.text) {
      gsap.fromTo(statusEl, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.35 });
      statusEl.innerText = matchedStatus.text;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        goToScreen('screen-name');
      }, 750);
    }
  }, 35);
}

// -------------------------------------------------------------
// SCREEN 4: COUNTDOWN SEQUENCE
// -------------------------------------------------------------
function startCountdownSequence() {
  const countEl = document.getElementById('countdown-number');
  let current = 3;

  startBackgroundMusic(); // Start audio context & background song

  if (countEl) {
    countEl.innerText = '3';
    gsap.fromTo(countEl, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
  }
  playCountdownPop(3);

  const timer = setInterval(() => {
    current -= 1;
    if (current > 0) {
      if (countEl) {
        countEl.innerText = current;
        gsap.fromTo(countEl, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
      }
      playCountdownPop(current);
    } else {
      clearInterval(timer);
      playChimeSound();
      goToScreen('screen-fireworks');
    }
  }, 1000);
}

// -------------------------------------------------------------
// SCREEN 6: FLOATING BALLOONS
// -------------------------------------------------------------
function spawnFloatingBalloons() {
  const container = document.getElementById('balloons-container');
  if (!container) return;

  container.innerHTML = '';
  state.balloonsPopped = 0;
  updateBalloonCounter();

  const colors = [
    '#FF4DA6', // Rich Pink
    '#7C3AED', // Royal Purple
    '#F5D061', // Champagne Gold
    '#FF758C', // Rose Pink
    '#3B82F6', // Blue
    '#EF4444'  // Crimson Red
  ];

  for (let i = 0; i < 24; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon-item';

    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = color;
    balloon.style.boxShadow = `0 12px 30px ${color}77`;

    const left = Math.random() * 90 + 5;
    const duration = Math.random() * 7 + 8;
    const delay = Math.random() * 6;

    balloon.style.left = `${left}%`;
    balloon.style.bottom = `-120px`;
    balloon.style.animation = `balloonUp ${duration}s linear infinite ${delay}s`;

    // Click to pop balloon
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      playChimeSound();
      triggerConfettiBurst();

      state.balloonsPopped += 1;
      updateBalloonCounter();

      gsap.to(balloon, {
        scale: 1.8,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => balloon.remove()
      });
    });

    container.appendChild(balloon);
  }

  // Keyframes for balloon float
  if (!document.getElementById('balloon-styles')) {
    const style = document.createElement('style');
    style.id = 'balloon-styles';
    style.innerHTML = `
      @keyframes balloonUp {
        0% { transform: translateY(0) rotate(0deg); bottom: -120px; }
        50% { transform: translateY(-55vh) rotate(9deg); }
        100% { transform: translateY(-115vh) rotate(-9deg); bottom: -120px; }
      }
    `;
    document.head.appendChild(style);
  }
}

function updateBalloonCounter() {
  const counter = document.getElementById('balloon-count');
  if (counter) {
    counter.innerText = state.balloonsPopped;
    gsap.fromTo(counter, { scale: 1.5 }, { scale: 1, duration: 0.3 });
  }
}

// -------------------------------------------------------------
// SCREEN 7: BIRTHDAY LETTER TYPEWRITER
// -------------------------------------------------------------
const letterMessage = `Happy Birthday, My Dearest Akka! ❤️

Today is not just another day—it is the celebration of someone who has filled my life with unconditional love, care, endless laughter, and strength.

Thank you for always believing in me, standing beside me through every high and low, and making every hard moment easier with your gentle warmth.

Your kindness, grace, and beautiful heart inspire me every single day.

I pray that your life is always filled with boundless happiness, radiant health, peace, success, and unforgettable moments.

May all your biggest dreams come true, and may your bright smile never fade.

No matter where life takes us, you will always be my first best friend, my guide, and my greatest blessing.

Happy Birthday, Akka!

I love you so much.

— Your Loving Brother ❤️`;

let typewriterTimer = null;

function startLetterTypewriter() {
  const container = document.getElementById('typewriter-text');
  if (!container) return;

  container.innerText = '';
  if (typewriterTimer) clearInterval(typewriterTimer);

  let index = 0;
  typewriterTimer = setInterval(() => {
    if (index < letterMessage.length) {
      container.innerText += letterMessage.charAt(index);
      index++;
    } else {
      clearInterval(typewriterTimer);
    }
  }, 26);

  const skipBtn = document.getElementById('letter-skip-btn');
  if (skipBtn) {
    skipBtn.onclick = () => {
      clearInterval(typewriterTimer);
      container.innerText = letterMessage;
    };
  }
}

// -------------------------------------------------------------
// SCREEN 9: 3D GIFT BOX
// -------------------------------------------------------------
function resetGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const giftMsg = document.getElementById('gift-message');

  if (giftBox) giftBox.classList.remove('opened');
  if (giftMsg) giftMsg.classList.add('hidden');

  if (giftBox) {
    giftBox.onclick = () => {
      if (!giftBox.classList.contains('opened')) {
        giftBox.classList.add('opened');
        playRibbonUntie();
        playChimeSound();
        triggerConfettiBurst();

        // 3D Shake effect
        gsap.to(giftBox, {
          rotation: 5,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          onComplete: () => {
            gsap.to(giftBox, { rotation: 0, duration: 0.2 });
          }
        });

        setTimeout(() => {
          if (giftMsg) {
            giftMsg.classList.remove('hidden');
            gsap.fromTo(giftMsg, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
          }
        }, 600);
      }
    };
  }
}
