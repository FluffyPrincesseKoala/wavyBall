import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import Ball from "./src/ball"
import Skull from "./src/skull"
import initGui from "./src/gui"
import initPlanes from "./src/planes"
import { initStars } from "./src/background"

import currentSettings from "./settings.json"
import Coffin from "./src/coffin"

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio);
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
// ball.mesh.visible = false
// scene.add(ball.mesh)
const skull = new Skull(scene, uniforms)

const coffin = new Coffin(scene, uniforms, skull)

const stars = initStars()
scene.add(stars)

const planeGroup = initPlanes(uniforms)
scene.add(planeGroup)

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// center the scene
scene.position.set(settings.scene.position.x, settings.scene.position.y, settings.scene.position.z);

// Audio input
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

// MIDI input
class MidiMacro {
  constructor() {
    this.getMIDIMessage = this.getMIDIMessage.bind(this)
    this.midiEvent = []
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(this.onMIDISuccess, this.onMIDIFailure);
    } else {
      console.warn("No MIDI support in your browser.");
    }
  }



  // Function to handle the MIDI messages
  getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          this.noteOn(note, velocity);
        } else {
          this.noteOff(note);
        }
        break;
      case 128: // noteOff
        this.noteOff(note);
        break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
      case 176: // cc
        this.handleCC(message.data[1], message.data[2]);
        break;
    }
  }
  // MIDI devices that send you data.
  onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    for (var input of inputs.values()) {
      input.onmidimessage = (message) => this.getMIDIMessage(message);
    }
  }

  onMIDIFailure() {
    console.error('Could not access your MIDI devices.');
  }

  // Functions to handle noteOn and noteOff
  noteOn(note, velocity) {
    // console.log('noteOn: ' + note + ' velocity: ' + velocity);

  }

  noteOff(note) {
    // console.log('noteOff: ' + note);
  }

  handleCC(cc, value) {
    // console.log("cc", cc, "value", value)
    const newEvent = { cc, value }
    //up to 22
    switch (cc) {
      case 7:
        newEvent.bloomComposer = { threshold: value / 127 }
        break
      case 8:
        newEvent.bloomComposer = { strength: value / 127 }
        break
      case 9:
        newEvent.bloomComposer = { radius: value / 127 }
        break
    }
    this.midiEvent.push(newEvent)
  }

  update(bloomPass) {
    if (this.midiEvent.length === 0) return
    console.log("midiEvent", this.midiEvent)
    for (const i in this.midiEvent) {
      const event = this.midiEvent[i]
      if (event.skull) {
        skull.update(event.skull.mouseX, event.skull.mouseY, event.skull.elapsedTime, uniforms)
      }
      if (event.bloomComposer) {
        const { threshold, strength, radius } = event.bloomComposer
        if (threshold) {
          bloomPass.threshold = threshold
        }
        if (strength) {
          bloomPass.strength = strength
        }
        if (radius) {
          bloomPass.radius = radius
        }
      }
      delete this.midiEvent[i]
    }
    // filter out empty events
    // this.midiEvent = this.midiEvent.filter(event => event !== undefined)
  }
}

const midi = new MidiMacro()

const controls = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()


// animate function
function animate() {
  requestAnimationFrame(animate)
  //update from midi
  midi.update(bloomPass)

  ball.update(mouseX, mouseY, clock.getElapsedTime())
  skull.update(mouseX, mouseY, clock.getElapsedTime(), uniforms)
  coffin.update(mouseX, mouseY, clock.getElapsedTime())

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
    camera.position.set(0, 0, 14)
    camera.lookAt(0, 0, 0)
    // reset bloom settings
    params.threshold = currentSettings.bloomPass.threshold
    params.strength = currentSettings.bloomPass.strength
    params.radius = currentSettings.bloomPass.radius
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    // reset planes rotation
    planeGroup.rotation.x = 0
    planeGroup.rotation.y = 0

  }
})