const phrases = [
  'AI researcher',
  'Builder',
  'Explorer of Generative Frontiers'
];
let i = 0;
let j = 0;
let current = '';
let isDeleting = false;
const speed = 100;
const element = document.getElementById('typewriter');

function type() {
  const full = phrases[i];
  if (isDeleting) {
    current = full.substring(0, j--);
  } else {
    current = full.substring(0, j++);
  }
  element.textContent = current;

  if (!isDeleting && j === full.length) {
    isDeleting = true;
    setTimeout(type, 1500);
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % phrases.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, isDeleting ? speed / 2 : speed);
  }
}

document.addEventListener('DOMContentLoaded', type);
