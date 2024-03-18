import * as THREE from "three";
import sphereVertexShader from "../glsl/sphere/vert.glsl";
import sphereFragmentShader from "../glsl/sphere/frag.glsl";

export default class Ball {
    constructor(scene, uniforms) {
        this.scene = scene;
        this.params = uniforms;
        const mat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: sphereVertexShader,
            fragmentShader: sphereFragmentShader,
        });

        const geo = new THREE.IcosahedronGeometry(6, 15);
        this.mesh = new THREE.Mesh(geo, mat);
        this.scene.add(this.mesh);
        this.mesh.material.wireframe = true;
    }

    update(mouseX, mouseY, elapsedTime) {
        this.mesh.rotation.x -= 0.0001 + mouseX * 0.0005;
        this.mesh.rotation.y -= 0.0001 + mouseY * 0.0005;
        this.mesh.rotation.z -= 0.0001 + mouseY * mouseX * 0.0005;

        this.params.u_mouse.value.x = mouseX;
        this.params.u_mouse.value.y = mouseY;
        this.params.u_time.value = elapsedTime;
    }
}
