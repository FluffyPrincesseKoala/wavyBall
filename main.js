import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import Ball from "./src/ball"
import initGui from "./src/gui"
import initPlanes from "./src/planes"

import currentSettings from "./settings.json"

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  450,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const settings = currentSettings

const params = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  threshold: currentSettings.bloomPass.threshold,
  strength: currentSettings.bloomPass.strength,
  radius: currentSettings.bloomPass.radius,
}

renderer.outputColorSpace = THREE.SRGBColorSpace

const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
)
bloomPass.threshold = params.threshold
bloomPass.strength = params.strength
bloomPass.radius = params.radius

const bloomComposer = new EffectComposer(renderer)
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

const outputPass = new OutputPass()
bloomComposer.addPass(outputPass)

camera.position.set(settings.camera.position.x, settings.camera.position.y, settings.camera.position.z)
camera.rotation.set(settings.camera.rotation.x, settings.camera.rotation.y, settings.camera.rotation.z)

const uniforms = {
  u_time: { type: "f", value: 0.0 },
  u_frequency: { type: "f", value: 0.0 },
  u_red: { type: "f", value: params.red },
  u_green: { type: "f", value: params.green },
  u_blue: { type: "f", value: params.blue },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  u_mouse: { type: "v2", value: new THREE.Vector2() },
}

const ball = new Ball(scene, uniforms)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("public/fond-texture-bois.jpg")

// create a coffin door
let geometry = new THREE.BufferGeometry();

// Define vertices of the door
const vertices = [
  // top top
  -0.8, 0, -0.7, // Top-left
  0.8, 0, -0.7, // Top-right
  1.6, 0, 1, // Bottom-right
  -1.6, 0, 1, // Bottom-left
  // top bottom (connected to the top Bottom-right & Bottom-left)
  -1.6, 0, 1, // Top-left
  1.6, 0, 1, // Top-right
  0.6, 0, 4.8, // Bottom-right
  -0.6, 0, 4.8, // Bottom-left
  // side top - top
  -0.8, 0, -0.7, // Top-left
  0.8, 0, -0.7, // Top-right
  1, -0.5, -1, // Bottom-right
  -1, -0.5, -1, // Bottom-left
  // side top - left
  -0.8, 0, -0.7, // Top-left
  -1.6, 0, 1, // Top-right
  -2, -0.5, 1, // Bottom-right
  -1, -0.5, -1, // Bottom-left
  // side top - right
  0.8, 0, -0.7, // Top-left
  1.6, 0, 1, // Top-right
  2, -0.5, 1, // Bottom-right
  1, -0.5, -1, // Bottom-left
  // side bottom - right
  1.6, 0, 1, // Top-left
  0.6, 0, 4.8, // Top-right
  1, -0.5, 5, // Bottom-right
  2, -0.5, 1, // Bottom-left
  // side bottom - left
  -1.6, 0, 1, // Top-left
  -0.6, 0, 4.8, // Top-right
  -1, -0.5, 5, // Bottom-right
  -2, -0.5, 1, // Bottom-left
  // bottom bottom
  -0.6, 0, 4.8, // Top-left
  0.6, 0, 4.8, // Top-right
  1, -0.5, 5, // Bottom-right
  -1, -0.5, 5, // Bottom-left

  // lid side bottom
  -1, -2, 5, // Top-left
  1, -2, 5, // Top-right
  1, -0.5, 5, // Bottom-right
  -1, -0.5, 5, // Bottom-left

  // lid top
  -1, -2, -1, // Top-left
  1, -2, -1, // Top-right
  1, -0.5, -1, // Bottom-right
  -1, -0.5, -1, // Bottom-left

  // bottom top
  -1, -2, -1, // Top-left
  1, -2, -1, // Top-right
  2, -2, 1, // Bottom-right
  -2, -2, 1, // Bottom-left
  // bottom bottom
  -2, -2, 1, // Top-left
  2, -2, 1, // Top-right
  1, -2, 5, // Bottom-right
  -1, -2, 5, // Bottom-left

  // bottom side
  -1, -2, -1, // Top-left
  -2, -2, 1, // Top-right
  -2, -0.5, 1, // Bottom-right
  -1, -0.5, -1, // Bottom-left

  // bottom side
  1, -2, -1, // Top-left
  2, -2, 1, // Top-right
  2, -0.5, 1, // Bottom-right
  1, -0.5, -1, // Bottom-left

  // bottom lid left
  -2, -2, 1, // Top-left
  -1, -2, 5, // bottom-right
  -1, -0.5, 5, // tôp-right
  -2, -0.5, 1, // Bottom-left

  // bottom lid right
  2, -2, 1, // Top-left
  1, -2, 5, // bottom-right
  1, -0.5, 5, // tôp-right
  2, -0.5, 1, // Bottom-left
];

// Define indices of the door
const indices = [
  // top
  0, 1, 2,
  0, 2, 3,
  // bottom
  4, 5, 6,
  4, 6, 7,
  // side top
  8, 9, 10,
  8, 10, 11,
  // side left
  12, 13, 14,
  12, 14, 15,
  // side right
  16, 17, 18,
  16, 18, 19,
  // side bottom right
  20, 21, 22,
  20, 22, 23,
  // side bottom left
  24, 25, 26,
  24, 26, 27,
  // bottom side
  28, 29, 30,
  28, 30, 31,

  // lid side bottom
  32, 33, 34,
  32, 34, 35,
  // lid top
  36, 37, 38,
  36, 38, 39,
  // bottom top
  40, 41, 42,
  40, 42, 43,
  // bottom bottom
  44, 45, 46,
  44, 46, 47,
  // bottom side
  48, 49, 50,
  48, 50, 51,
  // bottom side
  52, 53, 54,
  52, 54, 55,
  // bottom lid left
  56, 57, 58,
  56, 58, 59,
  // bottom lid right
  60, 61, 62,
  60, 62, 63,
];

// camera.position.set(0, 5, 5);

// Create attributes for vertices and indices
// geometry.setIndex(indices);
// geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// geometry.computeVertexNormals();
geometry.setAttribute('position', new THREE.BufferAttribute(new
  Float32Array(vertices), 3));
geometry.setIndex(new THREE.BufferAttribute(new
  Uint16Array(indices), 1));

// Add UVs if you want to apply a texture
let uv = [];
for (let i = 0; i < vertices.length / 2; i++) {
  uv.push(i % 2, 1 - Math.floor(i / 2) / 2);
}
geometry.setAttribute('uv', new THREE.BufferAttribute(new
  Float32Array(uv), 2));

// let material = new THREE.ShaderMaterial({
//   uniforms,
//   vertexShader: planeVertexShader,
//   fragmentShader: planeFragmentShader,
//   side: THREE.DoubleSide,
//   transparent: true,
//   // wireframe: true
// });
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
// let material = new THREE.MeshBasicMaterial({
//   map: texture,
//   side: THREE.DoubleSide
// });
let material = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
  color: 0x7d77ed
});
// Create the mesh
let coffin = new THREE.Mesh(geometry, material);

// add a cross to the coffin door from planes
const cross = new THREE.Group();
const crossMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0.8 });
const cross1 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4, 32), crossMaterial);
cross1.rotation.x = Math.PI / 2;
cross1.position.set(0, 0.1, 2);
cross.add(cross1);
const cross2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2, 32), crossMaterial);
cross2.rotation.x = Math.PI / 2;
cross2.rotation.z = Math.PI / 2;
cross2.position.set(0, 0.1, 1);
coffin.add(cross);
coffin.add(cross2);
// Add the mesh to the scene
scene.add(coffin);
coffin.position.set(0, 2, 1);
coffin.rotation.x = Math.PI / 2;
// add light to the scene
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// center the scene
scene.position.set(settings.scene.position.x, settings.scene.position.y, settings.scene.position.z);

/**
 * add starts to the scene
 */
const stars = new THREE.Group()
for (let i = 0; i < 100; i++) {
  const radius = THREE.MathUtils.randFloatSpread(i * 0.0035)
  const sphereGeo = new THREE.SphereGeometry(radius, 32, 32)
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  const x = THREE.MathUtils.randFloatSpread(150)
  const y = THREE.MathUtils.randFloatSpread(150)
  const z = -40
  sphere.position.set(x, y, z)
  stars.add(sphere)
}
scene.add(stars)

// add planes to the scene
const planeGroup = initPlanes(uniforms)
scene.add(planeGroup);

let audioContext, analyser
let isButtonPressed = false
const toggleButton = document.createElement("input")
toggleButton.type = "button"
toggleButton.value = "Toggle Audio Input"
const buttonStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
  border: "1px solid grey",
  padding: "10px",
  "background-color": "#363636",
  color: "#fff",
  cursor: "pointer",
  "border-radius": "5px",
}
Object.assign(toggleButton.style, buttonStyle)
document.body.appendChild(toggleButton)

toggleButton.addEventListener("click", function (e) {
  e.preventDefault()
  isButtonPressed = !isButtonPressed
  if (isButtonPressed && !audioContext) {
    // Code to execute when button is pressed
    // Place your code here
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 32
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        toggleButton.style.backgroundColor = "#006b09"
        toggleButton.value = "Audio Input Enabled"

        // set timeout and fade out button
        setTimeout(() => {
          toggleButton.style.animation =
            "3s ease-in 1s infinite reverse both running slidein"
        }, 2000)
      })
      .catch(function (err) {
        console.error("Error accessing microphone:", err)
        toggleButton.value = "Error accessing microphone"
        toggleButton.style.backgroundColor = "#8d2222"
      })
  }
})

const gui = initGui(camera, bloomPass, uniforms, params, scene)

let mouseX = 0
let mouseY = 0
document.addEventListener("mousemove", function (e) {
  let windowHalfX = window.innerWidth / 2
  let windowHalfY = window.innerHeight / 2
  mouseX = (e.clientX - windowHalfX) / 100
  mouseY = (e.clientY - windowHalfY) / 100
})
const controls = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()

// animate function
function animate() {
  requestAnimationFrame(animate)

  crossMaterial.emissiveIntensity = Math.max(1, Math.abs(Math.sin(clock.getElapsedTime() * 0.5)) * 2)
  crossMaterial.emissive = new THREE.Color(`hsl(${Math.abs(Math.sin(clock.getElapsedTime() * 0.5) * 360)}, 90%, 80%)`)

  // ball.update(mouseX, mouseY, clock.getElapsedTime())

  uniforms.u_mouse.value.x = mouseX
  uniforms.u_mouse.value.y = mouseY
  uniforms.u_time.value = clock.getElapsedTime()

  if (analyser) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)
    const averageFrequency =
      dataArray.reduce((a, b) => a + b, 0) / dataArray.length
    uniforms.u_frequency.value = averageFrequency
  }

  // update gui values
  gui.updateDisplay()

  // camera.position.x += (mouseX - camera.position.x) * 0.05
  // camera.position.y += (-mouseY - camera.position.y) * 0.5
  // camera.lookAt(scene.position)
  bloomComposer.render()
}
animate()

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  bloomComposer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener("keydown", function (e) {
  if (e.key === "r") {
    // reset camera position
    camera.position.set(0, -2, 14)
    camera.lookAt(0, 0, 0)
    // reset bloom settings
    params.threshold = 0.3
    params.strength = 0.5
    params.radius = 0.8
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    // reset colors
    params.red = 0.3
    params.green = 0.0
    params.blue = 0.2

    // reset planes rotation
    planeGroup.rotation.x = 0
    planeGroup.rotation.y = 0

  }
})