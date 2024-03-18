import * as THREE from "three"

import planeVertexShader from "../glsl/plane/vert.glsl"
import planeFragmentShader from "../glsl/plane/frag.glsl"

export default function createPlanes(uniforms) {

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
    return planeGroup
}