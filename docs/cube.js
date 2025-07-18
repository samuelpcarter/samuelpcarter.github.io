const SIZE = 40;
const SPACING = 42; // cubelet spacing
const ROT_DURATION = 300;

const colors = {
  U: 'white',
  D: 'yellow',
  F: 'green',
  B: 'blue',
  L: 'orange',
  R: 'red'
};

function identityMatrix() {
  return [
    [1,0,0],
    [0,1,0],
    [0,0,1]
  ];
}

function multiplyMatrix(A, B) {
  const R = [];
  for (let i=0;i<3;i++) {
    R[i] = [];
    for (let j=0;j<3;j++) {
      R[i][j] = A[i][0]*B[0][j] + A[i][1]*B[1][j] + A[i][2]*B[2][j];
    }
  }
  return R;
}

function rotationMatrix(axis, dir) {
  const s = dir;
  if (axis === 'x') {
    return [
      [1,0,0],
      [0,0,-s],
      [0,s,0]
    ];
  } else if (axis === 'y') {
    return [
      [0,0,s],
      [0,1,0],
      [-s,0,0]
    ];
  } else { // z
    return [
      [0,-s,0],
      [s,0,0],
      [0,0,1]
    ];
  }
}

function rotateCoord([x,y,z], axis, dir) {
  if (axis === 'x') {
    return [x, dir===1 ? -z : z, dir===1 ? y : -y];
  } else if (axis === 'y') {
    return [dir===1 ? z : -z, y, dir===1 ? -x : x];
  } else { // z
    return [dir===1 ? -y : y, dir===1 ? x : -x, z];
  }
}

function matrixToCss(m, x, y, z) {
  const tx = x * SPACING;
  const ty = -y * SPACING;
  const tz = z * SPACING;
  const arr = [
    m[0][0], m[1][0], m[2][0], 0,
    m[0][1], m[1][1], m[2][1], 0,
    m[0][2], m[1][2], m[2][2], 0,
    tx, ty, tz, 1
  ];
  return 'matrix3d(' + arr.join(',') + ')';
}

function createSticker(face) {
  const s = document.createElement('div');
  s.className = 'sticker ' + face;
  s.style.background = colors[face];
  return s;
}

class Cubelet {
  constructor(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    this.matrix = identityMatrix();
    this.el = document.createElement('div');
    this.el.className = 'cubelet';
    if (y === 1) this.el.appendChild(createSticker('U'));
    if (y === -1) this.el.appendChild(createSticker('D'));
    if (z === 1) this.el.appendChild(createSticker('F'));
    if (z === -1) this.el.appendChild(createSticker('B'));
    if (x === -1) this.el.appendChild(createSticker('L'));
    if (x === 1) this.el.appendChild(createSticker('R'));
    this.update();
  }
  update() {
    this.el.style.transform = matrixToCss(this.matrix, this.x, this.y, this.z);
  }
}

const cubelets = [];

function setupCube() {
  const cubeEl = document.getElementById('cube');
  cubeEl.innerHTML = '';
  cubelets.length = 0;
  for (let x=-1;x<=1;x++) {
    for (let y=-1;y<=1;y++) {
      for (let z=-1;z<=1;z++) {
        const c = new Cubelet(x,y,z);
        cubelets.push(c);
        cubeEl.appendChild(c.el);
      }
    }
  }
}

function rotateLayer(axis, layer, dir, cb) {
  const rot = rotationMatrix(axis, dir);
  const targets = cubelets.filter(c => c[axis] === layer);
  targets.forEach(c => {
    c.el.style.transition = `transform ${ROT_DURATION}ms`;
  });
  // trigger layout so transition applies
  void document.body.offsetWidth;
  targets.forEach(c => {
    c.matrix = multiplyMatrix(rot, c.matrix);
    const coord = rotateCoord([c.x,c.y,c.z], axis, dir);
    c.x = coord[0]; c.y = coord[1]; c.z = coord[2];
    c.update();
  });
  setTimeout(() => {
    targets.forEach(c => c.el.style.transition = '');
    if (cb) cb();
  }, ROT_DURATION);
}

const moveDefs = {
  U: {axis:'y', layer:1, dir:1},
  D: {axis:'y', layer:-1, dir:-1},
  F: {axis:'z', layer:1, dir:-1},
  B: {axis:'z', layer:-1, dir:1},
  R: {axis:'x', layer:1, dir:-1},
  L: {axis:'x', layer:-1, dir:1}
};

let moveQueue = [];
let animating = false;

function runNextMove() {
  if (moveQueue.length === 0) { animating = false; return; }
  animating = true;
  const {face, inverse} = moveQueue.shift();
  const def = moveDefs[face];
  rotateLayer(def.axis, def.layer, inverse ? -def.dir : def.dir, runNextMove);
}

function queueMove(face, inverse=false) {
  moveQueue.push({face, inverse});
  if (!animating) runNextMove();
}

function scramble() {
  const faces = Object.keys(moveDefs);
  for (let i=0;i<20;i++) {
    const f = faces[Math.floor(Math.random()*faces.length)];
    queueMove(f);
  }
}

function resetCube() {
  setupCube();
}

let rotX = -30;
let rotY = 45;
let dragging = false;
let startX, startY;

function updateCubeRotation() {
  const cubeEl = document.getElementById('cube');
  cubeEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function initMouseControls() {
  const scene = document.getElementById('scene');
  const cubeEl = document.getElementById('cube');
  scene.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startY = e.clientY; cubeEl.classList.add('dragging');
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    rotY += dx * 0.4;
    rotX -= dy * 0.4;
    updateCubeRotation();
    startX = e.clientX; startY = e.clientY;
  });
  document.addEventListener('mouseup', () => { dragging = false; cubeEl.classList.remove('dragging'); });
}

document.addEventListener('DOMContentLoaded', () => {
  setupCube();
  initMouseControls();
  document.getElementById('scramble').addEventListener('click', scramble);
  document.getElementById('solve').addEventListener('click', resetCube);
});

document.addEventListener('keydown', e => {
  const k = e.key.toUpperCase();
  if (moveDefs[k]) queueMove(k);
});
