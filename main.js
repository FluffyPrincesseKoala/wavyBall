import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

import vertexShader from './glsl/vert.glsl';
import fragmentShader from './glsl/frag.glsl';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  450,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const params = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  threshold: 0.3,
  strength: 0.5,
  radius: 0.8,
};

renderer.outputColorSpace = THREE.SRGBColorSpace;

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: 1.0 },
  u_green: { type: 'f', value: 1.0 },
  u_blue: { type: 'f', value: 1.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_mouse: { type: 'v2', value: new THREE.Vector2() },
};

const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const geo = new THREE.IcosahedronGeometry(4, 30);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;

const listener = new THREE.AudioListener();
camera.add(listener);

let isButtonPressed = false;

let audioContext, analyser
const toggleButton = document.createElement('input');
toggleButton.type = 'button';
toggleButton.value = 'Toggle Audio Input';
const buttonStyle = {
  'position': 'absolute',
  'top': '10px',
  'left': '10px',
  'border': '1px solid grey',
  'padding': '10px',
  'background-color': '#363636',
  'color': '#fff',
  'cursor': 'pointer',
  'border-radius': '5px',
}
Object.assign(toggleButton.style, buttonStyle);
document.body.appendChild(toggleButton);

toggleButton.addEventListener('click', function (e) {
  e.preventDefault();
  isButtonPressed = !isButtonPressed;
  if (isButtonPressed && !audioContext) {
    // Code to execute when button is pressed
    // Place your code here
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        toggleButton.style.backgroundColor = '#006b09';
        toggleButton.value = 'Audio Input Enabled';

        // set timeout and fade out button
        setTimeout(() => {
          toggleButton.style.animation = '3s ease-in 1s infinite reverse both running slidein';
        }, 2000);
      })
      .catch(function (err) {
        console.error('Error accessing microphone:', err);
        toggleButton.value = 'Error accessing microphone';
        toggleButton.style.backgroundColor = '#8d2222';
      });
  }
});

const gui = new GUI();

const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function (value) {
  uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function (value) {
  uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function (value) {
  uniforms.u_blue.value = Number(value);
});

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function (value) {
  bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function (value) {
  bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function (value) {
  bloomPass.radius = Number(value);
});

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function (e) {
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  mouseX = (e.clientX - windowHalfX) / 100;
  mouseY = (e.clientY - windowHalfY) / 100;
});
mesh.rotation.x = Math.PI;
const clock = new THREE.Clock();
function animate() {
  // mesh.rotation.x += 0.001 + mouseY * 0.001;
  // mesh.rotation.y += 0.001 + mouseX * 0.001;
  uniforms.u_mouse.value.x = mouseX;
  uniforms.u_mouse.value.y = mouseY;
  uniforms.u_time.value = clock.getElapsedTime();
  if (analyser) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray);
    // console.log(dataArray);
    const averageFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    uniforms.u_frequency.value = averageFrequency;
  }

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.5;
  camera.lookAt(scene.position);
  bloomComposer.render();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
});
