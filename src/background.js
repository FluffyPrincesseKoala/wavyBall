import * as THREE from 'three'
/**
 * add starts to the scene
 */
export function initStars() {
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
    return stars
}