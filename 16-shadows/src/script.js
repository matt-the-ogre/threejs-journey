import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {
    myFPSScreen: 0,
    myFPSRender: 0,
    myTriangles: 0,
    myGeometries: 0,
}
const debugFolder = gui.addFolder('Debug')
const myFPSScreenController = debugFolder.add(debugObject, 'myFPSScreen').name('screen FPS')
const myFPSRenderController = debugFolder.add(debugObject, 'myFPSRender').name('render FPS')
const myTrianglesController = debugFolder.add(debugObject, 'myTriangles').name('Triangles')
const myGeometriesController = debugFolder.add(debugObject, 'myGeometries').name('Geometries')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
ambientLight.visible = true
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
let guiDirectionalLightFolder = gui.addFolder('directional light')
guiDirectionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
guiDirectionalLightFolder.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
guiDirectionalLightFolder.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
guiDirectionalLightFolder.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 10
directionalLight.shadow.radius = 10
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

scene.add(directionalLight)
scene.add(directionalLightCameraHelper)

// spot light shining from the side, casting a shadow
const spotLight = new THREE.SpotLight(0xffaaaa, 0.5)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
scene.add(spotLight)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false

// point light shining from the top, casting a shadow
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(0, 5, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
scene.add(pointLight)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)
pointLightCameraHelper.visible = false

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
sphere.receiveShadow = true
// gui.add(sphere.castShadow, 'visible').name('sphere cast shadow')

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
// plane.receiveShadow = true

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x110000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

// cube that casts a shadow
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    material
)
cube.position.x = - 1.5
cube.position.y = 1.5
cube.castShadow = true
scene.add(cube)
scene.add(sphere, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

// FPS Variables
let lastTime = performance.now();
let frameCount = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // animate the directional light in the x axis between -2 and 2
    directionalLight.position.x = Math.sin(elapsedTime) * 2

    // animate the spot light in the z axis between -2 and 2
    spotLight.position.x = Math.sin(elapsedTime) * 2

    // animate the cube in the y axis between 0 and 2
    cube.position.y = Math.sin(elapsedTime * 2) + 1.5

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the sphere shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Render
    const renderStartTime = performance.now();
    renderer.render(scene, camera)
    const renderEndTime = performance.now();
    const lastRenderTime = renderEndTime - renderStartTime;

    // Calculate FPS
    const performanceTime = performance.now();
    frameCount++;
    // only update twice every second (500 milliseconds)
    const updatems = 250;
    if (performanceTime >= lastTime + updatems) {
        const framesPerSecondActual = frameCount*(1000/updatems)
        debugObject.myFPSScreen = framesPerSecondActual;
        debugObject.myFPSRender = (1000/lastRenderTime).toFixed(0);
        debugObject.myTriangles = renderer.info.render.triangles;
        debugObject.myGeometries = renderer.info.memory.geometries;
        myFPSScreenController.updateDisplay();
        myFPSRenderController.updateDisplay();
        myTrianglesController.updateDisplay();
        myGeometriesController.updateDisplay();
        
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()