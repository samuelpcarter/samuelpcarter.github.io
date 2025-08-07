const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x3d85c6 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Rocket
actionRocket();

function actionRocket() {
  const rocket = new THREE.Group();

  const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  rocket.add(body);

  const noseGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
  const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.y = 0.35;
  rocket.add(nose);

  const finGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.05);
  const finMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const fin1 = new THREE.Mesh(finGeometry, finMaterial);
  fin1.position.set(0.05, -0.25, 0);
  fin1.rotation.z = Math.PI / 4;
  const fin2 = fin1.clone();
  fin2.position.x = -0.05;
  fin2.rotation.z = -Math.PI / 4;
  rocket.add(fin1);
  rocket.add(fin2);

  scene.add(rocket);

  camera.position.z = 5;

  let angle = -Math.PI / 2;
  let radius = 0;
  const targetRadius = 3;

  function animate() {
    requestAnimationFrame(animate);
    angle += 0.01;
    if (radius < targetRadius) radius += 0.02;
    rocket.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    rocket.rotation.z = angle + Math.PI / 2;
    renderer.render(scene, camera);
  }

  animate();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
