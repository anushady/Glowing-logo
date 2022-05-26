// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.traverse(disposeMaterial);
scene.children.length = 0;

function disposeMaterial(obj) {
  if (obj.material) {
    obj.material.dispose();
  }
}

// GLTF Loader

var loader = new THREE.GLTFLoader();
var obj;
loader.load(
  // resource URL
  "svg3.glb",
  // called when the resource is loaded
  function (gltf) {
    obj = gltf.scene;
    scene.add(obj);
    obj.scale.set(24, 24, 24);

    obj.rotation.y = 0;

    // mixer1 = new THREE.AnimationMixer(obj);
    // console.log(gltf.animations)
    // mixer1.clipAction( gltf.animations[0]).play();
  }
);

var controlsa = {
  speed: 2,
  x: 3,
  y: 4,
  z: 1,
  min: -1,
  max: 10,
  step: 0.2,
};

var gui = new dat.GUI();

for (let param in controlsa) {
  if (!["min", "max", "step"].includes(param)) {
    gui
      .add(controlsa, param, controlsa.min, controlsa.max, controlsa.step)
      .listen();
  }
}

var particleGroups = 50;
var particles = 50;
var geometry = new THREE.BufferGeometry();
var positions = [];
var colors = [];

//gui.add(particleGroups, "i", 0, 1000, 50).name("Particle length");
var colorRng = [
  0x00ffe5,
  0xdefffc,
  0xff00f7, // red
  0xffd4fe,
  0xe0ffbd,
  0x00ff91, // orange
  0x4ff009d,
  0xaa00ff,
  0x00e1ff, // yellow
];

// generate base particle group vertices + colors
for (let i = 0; i < particles; i++) {
  // positions
  positions.push(
    THREE.Math.randFloatSpread(40),
    THREE.Math.randFloatSpread(30),
    THREE.Math.randFloatSpread(40)
  );

  // colors
  let c = THREE.Math.randInt(0, colorRng.length - 1);
  let color = new THREE.Color(colorRng[c]);
  colors.push(color.r, color.g, color.b);
}

geometry.addAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
geometry.computeBoundingSphere();

var material = new THREE.PointsMaterial({
  size: THREE.Math.randFloat(0.1, 0.1), // slight particle size variation
  vertexColors: THREE.VertexColors,
});

// create particle groups
for (i = 0; i < particleGroups; i++) {
  points = new THREE.Points(geometry, material);
  points.rotation.x = THREE.Math.randFloatSpread(3);
  points.rotation.y = THREE.Math.randFloatSpread(3);
  points.rotation.z = THREE.Math.randFloatSpread(30);
  points.name = `points${i}`;
  scene.add(points);
}

// Lights
const light = new THREE.AmbientLight(0xffffff, 0.9); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 1, 1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight2);
directionalLight2.position.set(1, -1, 1);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight3);
directionalLight3.position.set(-1, -1, -1);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight4);
directionalLight4.position.set(-1, 1, -1);

const directionalLight5 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight5);
directionalLight5.position.set(-1, -1, 1);

const directionalLight6 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight6);
directionalLight6.position.set(1, -1, -1);

const directionalLight7 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight7);
directionalLight7.position.set(1, 1, -1);

const directionalLight8 = new THREE.DirectionalLight(0xffffff, 0.15);
scene.add(directionalLight8);
directionalLight8.position.set(-1, 1, 1);

const directionalLight9 = new THREE.DirectionalLight(0xffffff, 0.2);
scene.add(directionalLight9);
directionalLight9.position.set(0, 0, 1);
/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 40;
scene.add(camera);

//Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};

const params = {
  exposure: 1,
  bloomStrength: 0.8,
  bloomThreshold: 0.4,
  bloomRadius: 0,
};
let composer, mixer;

const renderScene = new THREE.RenderPass(scene, camera);
const effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms.resolution.value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
//bloomPass.renderToScreen = true;

let gui3 = new dat.GUI();

gui3.add(bloomPass, "strength", 0, 5, 0.05).name("bloom Strength");
gui3.add(bloomPass, "threshold", 0, 1, 0.1).name("bloom Threshold");
gui3.add(bloomPass, "radius", 0, 10, 0.2).name("bloom Radius");

composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);

renderer.gammaInput = true;
//renderer.gammaOutput = true;
renderer.toneMappingExposure = Math.pow(0.9, 4.0);

/**
 * Animate
 */

document.addEventListener("mousemove", onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
}

//  const updateOnScroll = (event) => {
//      obj.position.z = window.scrollY *.002
//  }

//  window.addEventListener('scroll', updateOnScroll)

const clock = new THREE.Clock();
var prev = Date.now();

const tick = (timestamp) => {
  const deltaTime = clock.getDelta();
  //if ( mixer1 ) mixer1.update( deltaTime);

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  //Update objects
  if (obj) obj.rotation.y += 0.03 * (targetX - obj.rotation.y);
  if (obj) obj.rotation.x += 0.02 * (targetY - obj.rotation.x);
  if (obj) obj.position.x += 0.01 * (targetY - obj.position.x);
  if (obj) obj.position.y = 0.05 * (targetX - obj.position.y);
  //obj.rotation.z += -0.05 * (targetY - obj.rotation.x);
  if (obj) obj.position.z = 0.01 * (targetY - obj.position.x);

  let { speed, x, y, z } = controlsa;
  let now = Date.now();
  let t = now - prev;
  let duration = (-2 / speed) * 10000;
  let angle = (Math.PI * 2 * t) / duration;
  now = prev;

  // rotate particle groups, exponentiate on x, y & z values / i
  for (let i = 0; i < particleGroups; i++) {
    let points = scene.getObjectByName(`points${i}`);
    points.rotation.x = angle + i ** (x / i);
    points.rotation.y = angle + i ** (y / i);
    points.rotation.z = angle + i ** (z / i);
  }

  // Update Orbital Controls
  controls.update();

  renderer.clear();

  // Update Orbital Controls
  controls.update();
  composer.render();
  renderer.clearDepth();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  // Call tick again on the next frame
};

tick();
