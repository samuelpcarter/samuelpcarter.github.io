const phrases = [
  'Machine technician',
  'AI explorer',
  '3D printing specialist',
  'Bitcoin enthusiast'
];
let i = 0;
let j = 0;
let isDeleting = false;
const speed = 100;
const element = document.getElementById('typewriter');

function type() {
  const full = phrases[i];

  if (!isDeleting) {
    element.textContent = full.substring(0, j + 1);
    j++;
    if (j === full.length) {
      isDeleting = true;
      return setTimeout(type, 1500);
    }
  } else {
    element.textContent = full.substring(0, j - 1);
    j--;
    if (j === 0) {
      isDeleting = false;
      i = (i + 1) % phrases.length;
      return setTimeout(type, 500);
    }
  }

  setTimeout(type, isDeleting ? speed / 2 : speed);
}

document.addEventListener('DOMContentLoaded', type);
