import * as THREE from "three"

export default class Coffin {
    crossMaterial
    scene
    coffin
    constructor(scene, uniforms) {
        this.scene = scene;
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
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load("/fond-texture-bois.jpg")
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
        this.coffin = new THREE.Mesh(geometry, material);

        // add a cross to the coffin door from planes
        const cross = new THREE.Group();
        this.crossMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            emissive: 0xffffff,
            emissiveIntensity: 0.8
        });
        const cross1 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4, 32), this.crossMaterial);
        cross1.rotation.x = Math.PI / 2;
        cross1.position.set(0, 0.1, 2);
        cross.add(cross1);
        const cross2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2, 32), this.crossMaterial);
        cross2.rotation.x = Math.PI / 2;
        cross2.rotation.z = Math.PI / 2;
        cross2.position.set(0, 0.1, 1);
        this.coffin.add(cross);
        this.coffin.add(cross2);
        // Add the mesh to the scene
        this.scene.add(this.coffin);
        this.coffin.position.set(0, 2, 1);
        this.coffin.rotation.x = Math.PI / 2;

    }

    update(mouseX, mouseY, elapsedTime) {
        // this.mesh.rotation.x -= 0.0001 + mouseX * 0.0005;
        // this.mesh.rotation.y -= 0.0001 + mouseY * 0.0005;
        // this.mesh.rotation.z -= 0.0001 + mouseY * mouseX * 0.0005;
        // this.params.u_mouse.value.x = mouseX;
        // this.params.u_mouse.value.y = mouseY;
        // this.params.u_time.value = elapsedTime;
        this.crossMaterial.emissiveIntensity = Math.max(1, Math.abs(Math.sin(elapsedTime * 0.5)) * 2)
        this.crossMaterial.emissive = new THREE.Color(`hsl(${Math.abs(Math.sin(elapsedTime * 0.5) * 360)}, 90%, 80%)`)
        this.coffin.rotation.z += 0.01
    }
}