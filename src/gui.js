import { GUI } from "dat.gui"

export default function createGUI(camera, bloomPass, uniforms, params, scene) {
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

    const cameraFolder = gui.addFolder("Camera")
    cameraFolder.add(camera.position, "x", -10, 10)
    cameraFolder.add(camera.position, "y", -10, 10)
    cameraFolder.add(camera.position, "z", -10, 10)
    cameraFolder.add(camera.rotation, "x", -Math.PI, Math.PI)
    cameraFolder.add(camera.rotation, "y", -Math.PI, Math.PI)
    cameraFolder.add(camera.rotation, "z", -Math.PI, Math.PI)
    cameraFolder.add(camera, "fov", 1, 180).onChange(function () {
        camera.updateProjectionMatrix()
    })
    cameraFolder.open()

    const sceneFolder = gui.addFolder("Scene")
    sceneFolder.add(scene.position, "x", -10, 10, 0.1)
    sceneFolder.add(scene.position, "y", -10, 10, 0.1)
    sceneFolder.add(scene.position, "z", -10, 10, 0.1)
    sceneFolder.open()

    // add a button that allows to generate a json file with the current gui settings for camera
    const saveButton = document.createElement("input")
    saveButton.type = "button"
    saveButton.value = "Save Camera Settings"
    Object.assign(saveButton.style, {
        position: "absolute",
        bottom: "1vh",
        right: "10px",
        border: "1px solid grey",
        padding: "10px",
        "background-color": "#363636",
        color: "#fff",
        cursor: "pointer",
        "border-radius": "5px",
    })
    saveButton.addEventListener("click", function () {
        const settings = {
            camera: {
                position: {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z,
                },
                rotation: {
                    x: camera.rotation.x,
                    y: camera.rotation.y,
                    z: camera.rotation.z,
                },
            },
            scene: {
                position: {
                    x: scene.position.x,
                    y: scene.position.y,
                    z: scene.position.z,
                },
            },
            bloomPass: {
                threshold: bloomPass.threshold,
                strength: bloomPass.strength,
                radius: bloomPass.radius,
            },
        }
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(settings, null, 2))
        const downloadAnchorNode = document.createElement("a")
        downloadAnchorNode.setAttribute("href", dataStr)  // set the href attribute
        downloadAnchorNode.setAttribute("download", "settings.json")  // set the download attribute
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    })
    document.body.appendChild(saveButton)

    return gui
}