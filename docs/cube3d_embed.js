// Three.js Rubik's Cube implementation with adjustable size
// Colors tweaked to match site style

const scene = new THREE.Scene();
const container = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const width = container.clientWidth;
const height = container.clientHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
renderer.setSize(width, height);
container.appendChild(renderer.domElement);
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.setClearColor(0x000000, 0);

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const colors = [
  new THREE.MeshPhongMaterial({ color: 0xff4d4d, shininess: 50 }), // front
  new THREE.MeshPhongMaterial({ color: 0x4d79ff, shininess: 50 }), // back
  new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 50 }), // up
  new THREE.MeshPhongMaterial({ color: 0xffea00, shininess: 50 }), // down
  new THREE.MeshPhongMaterial({ color: 0x4dff4d, shininess: 50 }), // left
  new THREE.MeshPhongMaterial({ color: 0xff9933, shininess: 50 })  // right
];
const hiddenMaterial = new THREE.MeshPhongMaterial({ color: 0x2f2f2f, shininess: 50 });

let cubeSize = 3;
const cubelets = [];
const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);
const scrambleHistory = [];
let runningSequence = null;
let executedMoves = [];
let cancelSequence = false;

function runWhenReady(fn) {
  if (!isRotatingLayer) {
    fn();
  } else {
    rotationCallback = fn;
  }
}

function initCube(size) {
  cubelets.length = 0;
  cubeGroup.clear();
  const offset = (size - 1) / 2;
  for (let xi = 0; xi < size; xi++) {
    const x = xi - offset;
    for (let yi = 0; yi < size; yi++) {
      const y = yi - offset;
      for (let zi = 0; zi < size; zi++) {
        const z = zi - offset;
        const materials = [
          x === offset ? colors[5] : hiddenMaterial,
          x === -offset ? colors[4] : hiddenMaterial,
          y === offset ? colors[2] : hiddenMaterial,
          y === -offset ? colors[3] : hiddenMaterial,
          z === offset ? colors[0] : hiddenMaterial,
          z === -offset ? colors[1] : hiddenMaterial
        ];
        const cubelet = new THREE.Mesh(geometry, materials);
        cubelet.position.set(x, y, z);
        cubeGroup.add(cubelet);
        cubelets.push(cubelet);
      }
    }
  }
  camera.position.set(size * 1.5, size * 1.5, size * 1.5);
  camera.lookAt(0, 0, 0);
}

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const targetQuaternion = new THREE.Quaternion();
let isRotatingLayer = false;
let rotationData = { axis: new THREE.Vector3(), angle: 0, center: new THREE.Vector3(), cubelets: [] };

const keyMap = {
  f: new THREE.Vector3(0, 0, 1),
  u: new THREE.Vector3(0, 1, 0),
  r: new THREE.Vector3(1, 0, 0),
  l: new THREE.Vector3(-1, 0, 0),
  d: new THREE.Vector3(0, -1, 0),
  b: new THREE.Vector3(0, 0, -1)
};

function onKeyDown(event) {
  if (isRotatingLayer) return;
  const key = event.key.toLowerCase();
  const numMatch = key.match(/\d+/);
  const number = numMatch ? parseInt(numMatch[0], 10) : 0;
  if (number >= 0 && number < cubeSize) {
    const base = key.replace(/\d+/g, '');
    const axis = keyMap[base];
    if (axis) {
      const center = axis.clone().multiplyScalar(number - (cubeSize - 1) / 2);
      startLayerRotation(center, axis);
      animateRotation();
    }
  }
}

// Disable manual cube manipulation

function startLayerRotation(center, axis) {
  isRotatingLayer = true;
  rotationData = { axis, angle: 0, center, cubelets: [] };
  const threshold = 0.6;
  cubelets.forEach(cubelet => {
    const pos = cubelet.position.clone();
    if (
      (Math.abs(axis.x) === 1 && Math.abs(pos.x - center.x) < threshold) ||
      (Math.abs(axis.y) === 1 && Math.abs(pos.y - center.y) < threshold) ||
      (Math.abs(axis.z) === 1 && Math.abs(pos.z - center.z) < threshold)
    ) {
      cubelet.userData.offset = pos.clone().sub(center);
      cubelet.userData.startQuat = cubelet.quaternion.clone();
      rotationData.cubelets.push(cubelet);
    }
  });
}

let rotationCallback = null;
function animateRotation(cb) {
  if (cb) rotationCallback = cb;
  if (!isRotatingLayer) {
    if (rotationCallback) { const fn = rotationCallback; rotationCallback = null; fn(); }
    return;
  }
  const targetAngle = Math.PI / 2;
  rotationData.angle = Math.min(rotationData.angle + 0.1, targetAngle);
  const t = rotationData.angle / targetAngle;
  const easedT = t * t * (3 - 2 * t);
  const quat = new THREE.Quaternion().setFromAxisAngle(rotationData.axis, easedT * Math.PI / 2);
  rotationData.cubelets.forEach(c => {
    c.position.copy(c.userData.offset.clone().applyQuaternion(quat).add(rotationData.center));
    c.quaternion.copy(quat.clone().multiply(c.userData.startQuat));
  });
  if (rotationData.angle >= targetAngle) {
    const finalQuat = new THREE.Quaternion().setFromAxisAngle(rotationData.axis, Math.PI / 2);
    rotationData.cubelets.forEach(c => {
      c.position.set(
        Math.round(c.position.x * 2) / 2,
        Math.round(c.position.y * 2) / 2,
        Math.round(c.position.z * 2) / 2
      );
      c.quaternion.copy(finalQuat.clone().multiply(c.userData.startQuat));
    });
    isRotatingLayer = false;
    rotationData = { axis: new THREE.Vector3(), angle: 0, center: new THREE.Vector3(), cubelets: [] };
    if (rotationCallback) { const fn = rotationCallback; rotationCallback = null; fn(); }
  } else {
    setTimeout(() => animateRotation(), 16);
  }
}

renderer.domElement.addEventListener('mousedown', e => {
  if (isRotatingLayer) return;
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', e => {
  if (isDragging && !isRotatingLayer) {
    const delta = { x: -(e.clientX - previousMousePosition.x), y: -(e.clientY - previousMousePosition.y) };
    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(delta.y * 0.002, delta.x * 0.002, 0, 'XYZ'));
    targetQuaternion.multiply(quat);
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

document.addEventListener('mouseup', () => { isDragging = false; });

function animate() {
  cubeGroup.quaternion.slerp(targetQuaternion, 0.1);
  renderer.render(scene, camera);
  setTimeout(animate, 16);
}
animate();

function runSequence(moves, onDone) {
  runningSequence = moves.slice();
  executedMoves = [];
  function next() {
    if (cancelSequence) {
      cancelSequence = false;
      runningSequence = [];
    }
    if (runningSequence.length === 0) {
      runningSequence = null;
      if (onDone) onDone();
      return;
    }
    const move = runningSequence.shift();
    startLayerRotation(move.center, move.axis);
    animateRotation(() => {
      executedMoves.push(move);
      next();
    });
  }
  next();
}

function scramble() {
  cancelSequence = true;
  const axes = Object.values(keyMap);
  const moves = [];
  let lastAxis = null;
  let lastLayer = null;
  for (let i = 0; i < 20; i++) {
    let axis, layer;
    do {
      axis = axes[Math.floor(Math.random() * 6)];
      layer = Math.floor(Math.random() * cubeSize) - (cubeSize - 1) / 2;
      if (Math.random() < 0.3) layer = 0; // middle layer turns sometimes
    } while (lastAxis && axis.equals(lastAxis) && (layer === lastLayer || layer === -lastLayer));
    const center = axis.clone().multiplyScalar(layer);
    moves.push({ axis, center });
    lastAxis = axis;
    lastLayer = layer;
  }
  scrambleHistory.length = 0;
  scrambleHistory.push(...moves);
  executedMoves = [];
  runWhenReady(() => runSequence(moves));
}

function solve() {
  cancelSequence = true;
  let moves;
  if (runningSequence) {
    moves = executedMoves.slice().reverse().map(m => ({ axis: m.axis.clone().negate(), center: m.center }));
  } else {
    moves = scrambleHistory.slice().reverse().map(m => ({ axis: m.axis.clone().negate(), center: m.center }));
  }
  executedMoves = [];
  runWhenReady(() => runSequence(moves, () => { scrambleHistory.length = 0; }));
}

function resetCube() {
  cancelSequence = true;
  executedMoves = [];
  scrambleHistory.length = 0;
  initCube(cubeSize);
  targetQuaternion.set(0, 0, 0, 1);
  cubeGroup.quaternion.set(0, 0, 0, 1);
}

document.getElementById('scramble').addEventListener('click', scramble);
document.getElementById('solve').addEventListener('click', solve);
document.getElementById('reset').addEventListener('click', resetCube);

window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

initCube(cubeSize);
