import * as THREE from "three"
import { GUI } from "dat.gui"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass"

import sphereVertexShader from "./glsl/sphere/vert.glsl"
import sphereFragmentShader from "./glsl/sphere/frag.glsl"
import planeVertexShader from "./glsl/plane/vert.glsl"
import planeFragmentShader from "./glsl/plane/frag.glsl"

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

const params = {
  red: 0.3,
  green: 0.0,
  blue: 0.2,
  threshold: 0.3,
  strength: 0.11,
  radius: 0.8,
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

camera.position.set(0, -2, 14)
camera.lookAt(0, 0, 0)

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

const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
})

const geo = new THREE.IcosahedronGeometry(4, 10)
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)
mesh.material.wireframe = true

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

const planeGeo = new THREE.PlaneGeometry(40, 40, 30, 30)
const planeMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
})
planeMat.transparent = true
planeMat.opacity = 0.1
planeMat.wireframe = true

const planes = {
  bottom: undefined,
  top: undefined,
  left: undefined,
  right: undefined,
  back: undefined,
  front: undefined,
}
// create 6 planes to make a box
planes.bottom = new THREE.Mesh(planeGeo, planeMat) // bottom
planes.bottom.rotation.x = Math.PI / 2
planes.bottom.position.set(0, -20, 0)

planes.top = new THREE.Mesh(planeGeo, planeMat) // top
planes.top.rotation.x = -Math.PI / 2
planes.top.position.set(0, 20, 0)

planes.left = new THREE.Mesh(planeGeo, planeMat) // left
planes.left.rotation.y = Math.PI / 2
planes.left.position.set(-20, 0, 0)

planes.right = new THREE.Mesh(planeGeo, planeMat) // right
planes.right.rotation.y = -Math.PI / 2
planes.right.position.set(20, 0, 0)

planes.back = new THREE.Mesh(planeGeo, planeMat) // back
planes.back.rotation.y = Math.PI
planes.back.position.set(0, 0, -20)

planes.front = new THREE.Mesh(planeGeo, planeMat) // front
planes.front.position.set(0, 0, 20)

const planeGroup = new THREE.Group()
for (const plane in planes) {
  planeGroup.add(planes[plane])
}
// add a center point to the scene
const center = new THREE.Vector3(0, 0, 0);
planeGroup.position.copy(center);
scene.add(planeGroup);

// const listener = new THREE.AudioListener()
// camera.add(listener)

let isButtonPressed = false

let audioContext, analyser
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

const gui = new GUI()

const colorsFolder = gui.addFolder("Colors")
colorsFolder.add(params, "red", 0, 1).onChange(function (value) {
  uniforms.u_red.value = Number(value)
})
colorsFolder.add(params, "green", 0, 1).onChange(function (value) {
  uniforms.u_green.value = Number(value)
})
colorsFolder.add(params, "blue", 0, 1).onChange(function (value) {
  uniforms.u_blue.value = Number(value)
})

const bloomFolder = gui.addFolder("Bloom")
bloomFolder.add(params, "threshold", 0, 1).onChange(function (value) {
  bloomPass.threshold = Number(value)
})
bloomFolder.add(params, "strength", 0, 3).onChange(function (value) {
  bloomPass.strength = Number(value)
})
bloomFolder.add(params, "radius", 0, 1).onChange(function (value) {
  bloomPass.radius = Number(value)
})

let mouseX = 0
let mouseY = 0
document.addEventListener("mousemove", function (e) {
  let windowHalfX = window.innerWidth / 2
  let windowHalfY = window.innerHeight / 2
  mouseX = (e.clientX - windowHalfX) / 100
  mouseY = (e.clientY - windowHalfY) / 100
})
mesh.rotation.x = Math.PI
const clock = new THREE.Clock()
function animate() {
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

  // rotate planes around the scene
  planeGroup.rotation.y -= (0.0001 + mouseX * 0.001)
  planeGroup.rotation.x -= (0.0001 + mouseY * 0.001)

  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.5
  camera.lookAt(scene.position)
  bloomComposer.render()
  requestAnimationFrame(animate)
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