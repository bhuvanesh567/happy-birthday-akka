// Canvas Particle Engine: Glowing Fireflies, 3D Swaying Rose Petals & Twinkling Constellations

let canvas, ctx;
let width, height;
let fireflies = [];
let petals = [];
let stars = [];

class Firefly {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.8 + 1.2;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    this.alpha = Math.random() * 0.6 + 0.3;
    this.alphaSpeed = (Math.random() - 0.5) * 0.025;
    this.color = Math.random() > 0.4 ? '#F5D061' : '#FF4DA6';
    this.glowRadius = Math.random() * 12 + 8;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha += this.alphaSpeed;

    if (this.alpha <= 0.2 || this.alpha >= 0.9) this.alphaSpeed = -this.alphaSpeed;
    if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    // Soft outer glowing aura
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowRadius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Solid core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class RosePetal {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = -30;
    this.size = Math.random() * 10 + 7;
    this.speedY = Math.random() * 1.4 + 0.8;
    this.swaySpeed = Math.random() * 0.03 + 0.015;
    this.swayAmplitude = Math.random() * 1.5 + 0.5;
    this.swayAngle = Math.random() * Math.PI * 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 2.5;
    this.opacity = Math.random() * 0.55 + 0.35;
    this.color = Math.random() > 0.3 ? '#FF4DA6' : '#FF758C';
  }
  update() {
    this.y += this.speedY;
    this.swayAngle += this.swaySpeed;
    this.x += Math.sin(this.swayAngle) * this.swayAmplitude;
    this.rotation += this.rotationSpeed;
    if (this.y > height + 30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    // Elegant 3D Petal Curve
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.55, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Highlight vein
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.6, 0);
    ctx.lineTo(this.size * 0.6, 0);
    ctx.stroke();

    ctx.restore();
  }
}

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.012 + 0.004;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0.1) this.speed = -this.speed;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.abs(this.alpha);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function initBackgroundParticles() {
  canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resize();
  window.addEventListener('resize', resize);

  fireflies = Array.from({ length: 50 }, () => new Firefly());
  petals = Array.from({ length: 30 }, () => new RosePetal());
  stars = Array.from({ length: 80 }, () => new Star());

  animate();
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach(s => { s.update(); s.draw(); });
  fireflies.forEach(f => { f.update(); f.draw(); });
  petals.forEach(p => { p.update(); p.draw(); });

  requestAnimationFrame(animate);
}
