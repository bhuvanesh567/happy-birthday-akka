import confetti from 'canvas-confetti';
import { playFireworksSound } from '../audio.js';

let canvas, ctx;
let width, height;
let fireworks = [];
let particles = [];
let isRunning = false;

class Firework {
  constructor(targetX, targetY) {
    this.x = Math.random() * width * 0.8 + width * 0.1;
    this.y = height;
    this.targetX = targetX || Math.random() * width * 0.8 + width * 0.1;
    this.targetY = targetY || Math.random() * height * 0.45 + height * 0.1;
    this.speed = Math.random() * 3 + 9;
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed
    };
    this.trail = [];
    this.color = ['#F5D061', '#FF4DA6', '#7C3AED', '#00F0FF', '#FF3366', '#FFFFFF'][Math.floor(Math.random() * 6)];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) this.trail.shift();

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    if (dist < 12 || this.y <= this.targetY) {
      this.explode();
      return false;
    }
    return true;
  }

  draw() {
    ctx.save();
    // Trail line
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.trail.length > 0) {
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let point of this.trail) {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();

    // Rocket head
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  explode() {
    playFireworksSound();
    triggerScreenFlash();

    const count = 55;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 1.5;
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.012;
    this.gravity = 0.09;
    this.friction = 0.96;
    this.size = Math.random() * 2.5 + 1.5;
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;

    return this.alpha > 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function triggerScreenFlash() {
  const flash = document.getElementById('screen-flash');
  if (flash) {
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 150);
  }
}

export function initFireworksCanvas() {
  canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

export function triggerFireworksShow(durationMs = 5500) {
  if (!canvas) initFireworksCanvas();
  isRunning = true;

  const interval = setInterval(() => {
    fireworks.push(new Firework());
  }, 350);

  // High-density confetti burst
  triggerConfettiBurst();

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => { isRunning = false; }, 2500);
  }, durationMs);

  animate();
}

export function triggerConfettiBurst() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.55 },
    colors: ['#F5D061', '#FF4DA6', '#7C3AED', '#FFFFFF', '#FFD700']
  });
}

function animate() {
  if (!isRunning && fireworks.length === 0 && particles.length === 0) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  ctx.fillStyle = 'rgba(5, 5, 8, 0.22)';
  ctx.fillRect(0, 0, width, height);

  fireworks = fireworks.filter(fw => {
    const alive = fw.update();
    if (alive) fw.draw();
    return alive;
  });

  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw();
    return alive;
  });

  requestAnimationFrame(animate);
}
