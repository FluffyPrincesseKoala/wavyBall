import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default class Skull {
    constructor(scene, uniforms) {
        this.scene = scene;
        this.params = uniforms;
        // load the skull model
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        this.skull = new THREE.Object3D();
        loader.load('/skull/scene.gltf', (gltf) => {
            this.skull.add(gltf.scene);
            this.skull.position.set(0, 3, 8.5);
            this.skull.scale.set(150, 150, 150);
            this.skull.rotateX(Math.PI / 4.5);
            this.skull.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshToonMaterial({
                        depthTest: true,
                        depthWrite: true,
                        alphaTest: 0.5,
                        visible: true,
                        side: THREE.FrontSide,
                        // color: 'blue',
                        emissive: 0x9780ff,
                        emissiveIntensity: 0.8,
                        emissiveMap: child.material.normalMap,
                    });

                    // child.material.emissive = new THREE.Color(0x1e1e3f);
                    // child.material.emissiveIntensity = 0.5;
                    // child.material.color = new THREE.Color(0xffffff)
                    // child.material.side = THREE.DoubleSide;
                    // child.material.flatShading = true;
                    // child.material.transparent = true;
                    // child.material.opacity = 0.7;

                }
            });
            this.scene.add(this.skull);
        })
    }

    update(mouseX, mouseY, elapsedTime, uniforms) {
        // rotate the skull
        // this.skull.rotation.y += 0.01;
        const freq = uniforms.u_frequency.value;
        this.skull.rotation.y += freq * 0.001;
        const freqToScale = 100 + freq * 0.5;
        this.skull.scale.set(freqToScale, freqToScale, freqToScale);
    }
}
