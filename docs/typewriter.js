const basePhrases = [
  'Hardware hacker',
  'Robot builder',
  'Trail adventurer',
  'Tech tinkerer'
];

function shuffle(arr) {
  for (let n = arr.length - 1; n > 0; n--) {
    const r = Math.floor(Math.random() * (n + 1));
    [arr[n], arr[r]] = [arr[r], arr[n]];
  }
  return arr;
}

let phrases = shuffle(basePhrases.slice());
let i = 0;
let j = 0;
let isDeleting = false;
const speed = 100;
const element = document.getElementById('typewriter');

function nextPhrase() {
  i++;
  if (i >= phrases.length) {
    phrases = shuffle(basePhrases.slice());
    i = 0;
  }
}

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
      element.innerHTML = '&nbsp;';
      isDeleting = false;
      nextPhrase();
      return setTimeout(type, 500);
    }
  }

  setTimeout(type, isDeleting ? speed / 2 : speed);
}

document.addEventListener('DOMContentLoaded', type);
