// Dual-Layer Interactive Cursor: Ring Follower + Heart/Stardust Trail

let canvas, ctx;
let width, height;
let heartParticles = [];
let mouseX = -100;
let mouseY = -100;
let followerX = -100;
let followerY = -100;

class CursorParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isHeart = Math.random() > 0.4;
    this.size = this.isHeart ? (Math.random() * 14 + 10) : (Math.random() * 4 + 2);
    this.alpha = 1;
    this.speedY = Math.random() * -1.8 - 0.6;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.decay = Math.random() * 0.02 + 0.015;
    this.color = Math.random() > 0.5 ? '#FF4DA6' : '#F5D061';
    this.rotation = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
    return this.alpha > 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    if (this.isHeart) {
      // Draw Heart Shape
      ctx.beginPath();
      const d = this.size / 2;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-d, -d, -this.size, d / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, d / 3, d, -d, 0, 0);
      ctx.fill();
    } else {
      // Draw Sparkle Star
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export function initCursorTrail() {
  canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resize();
  window.addEventListener('resize', resize);

  const follower = document.getElementById('cursor-follower');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (Math.random() > 0.35) {
      heartParticles.push(new CursorParticle(mouseX, mouseY));
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      heartParticles.push(new CursorParticle(mouseX, mouseY));
    }
  });

  function updateFollower() {
    if (follower && mouseX > 0) {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
    }
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  animate();
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  heartParticles = heartParticles.filter(h => {
    const alive = h.update();
    if (alive) h.draw();
    return alive;
  });

  requestAnimationFrame(animate);
}
