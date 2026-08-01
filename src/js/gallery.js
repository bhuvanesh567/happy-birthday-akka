// Memory Gallery & Lightbox Controller with 3D Tilt & Real Photographs

import gsap from 'gsap';

export const initialPhotos = [
  {
    id: 1,
    title: "Precious Motherly Love ❤️",
    caption: "Akka with pure warmth, care, and unconditional love",
    src: "./gallery/real1.jpg",
    objectPosition: "center 22%"
  },
  {
    id: 2,
    title: "Temple Smiles & Sisterhood ✨",
    caption: "Unforgettable moments of laughter and togetherness",
    src: "./gallery/real2.jpg",
    objectPosition: "center 30%"
  },
  {
    id: 3,
    title: "Always Standing Together 💖",
    caption: "My biggest supporter, guide, and blessing forever",
    src: "./gallery/real3.png",
    objectPosition: "center 18%"
  },
  {
    id: 4,
    title: "Playing For My Akka 🎸",
    caption: "Dedicated to the best elder sister in the whole world",
    src: "./gallery/real4.png",
    objectPosition: "center 10%"
  }
];

let currentPhotoList = [...initialPhotos];

export function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = '';

  currentPhotoList.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.setAttribute('data-id', photo.id);

    const pos = photo.objectPosition || 'center 20%';

    card.innerHTML = `
      <div class="photo-img-wrapper">
        <img src="${photo.src}" alt="${photo.title}" style="object-position: ${pos};" loading="lazy">
      </div>
      <div class="photo-info">
        <h3 class="photo-title heading-cinzel">${photo.title}</h3>
        <p class="photo-caption font-serif">${photo.caption}</p>
      </div>
    `;

    // 3D Tilt interaction with GSAP smooth interpolation
    card.addEventListener('mousemove', (e) => handle3DTilt(e, card));
    card.addEventListener('mouseleave', () => reset3DTilt(card));

    // Lightbox click
    card.addEventListener('click', () => openLightbox(photo));

    grid.appendChild(card);
  });

  // Stagger entry animation for cards
  gsap.from(grid.children, {
    opacity: 0,
    y: 35,
    scale: 0.9,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out"
  });

  setupCustomPhotoUpload();
  setupLightboxListeners();
}

function handle3DTilt(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / -10;
  const rotateY = (x - centerX) / 10;

  gsap.to(card, {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`,
    duration: 0.25,
    ease: "power1.out"
  });
}

function reset3DTilt(card) {
  gsap.to(card, {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    duration: 0.5,
    ease: "power2.out"
  });
}

// Lightbox Modal Logic
let currentLikes = 100;

function openLightbox(photo) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const likeCount = document.getElementById('like-count');

  if (!modal || !img) return;

  img.src = photo.src;
  title.innerText = photo.title;
  desc.innerText = photo.caption;
  likeCount.innerText = currentLikes;

  modal.classList.add('active');

  const content = modal.querySelector('.lightbox-content');
  if (content) {
    gsap.fromTo(content, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
    );
  }
}

function setupLightboxListeners() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const backdrop = modal?.querySelector('.lightbox-backdrop');
  const likeBtn = document.getElementById('lightbox-like-btn');

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.onclick = closeModal;
  if (backdrop) backdrop.onclick = closeModal;

  if (likeBtn) {
    likeBtn.onclick = () => {
      currentLikes += 1;
      const likeCount = document.getElementById('like-count');
      if (likeCount) likeCount.innerText = currentLikes;

      gsap.fromTo(likeBtn, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "elastic.out(1.2, 0.4)" });
    };
  }
}

// Custom Photo Upload Option
function setupCustomPhotoUpload() {
  const uploadBtn = document.getElementById('upload-photo-btn');
  const fileInput = document.getElementById('custom-photo-input');

  if (!uploadBtn || !fileInput) return;

  uploadBtn.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now(),
          title: "Treasured Memory ❤️",
          caption: "Custom memory added with love",
          src: event.target.result,
          objectPosition: "center 20%"
        };
        currentPhotoList.unshift(newPhoto);
        renderGallery();
      };
      reader.readAsDataURL(file);
    }
  };
}
