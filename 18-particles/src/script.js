import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { fullScreenSwitch } from './utils';

THREE.ColorManagement.enabled = false

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
    // myNumParticles: 500,
}
const debugFolder = gui.addFolder('Debug')
const myFPSScreenController = debugFolder.add(debugObject, 'myFPSScreen').name('screen FPS')
const myFPSRenderController = debugFolder.add(debugObject, 'myFPSRender').name('render FPS')
const myTrianglesController = debugFolder.add(debugObject, 'myTriangles').name('Triangles')
const myGeometriesController = debugFolder.add(debugObject, 'myGeometries').name('Geometries')
// const myNumParticlesController = debugFolder.add(debugObject, 'myNumParticles').min(100).max(10000).step(100).name('Particles') // 500

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Particles
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
// const particlesGeometry = new THREE.ConeGeometry(1, 1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()
// create 500 geometries for particles
const count = 500000
// a position array with 3 values for each vertex
const positions = new Float32Array(count * 3)
// a color array with 3 values for each vertex
const colors = new Float32Array(count * 3)
// fill the arrays with random values
for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
// set the attributes of the geometry
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    // depthWrite: false,
    // blending: THREE.AdditiveBlending,
    // vertexColors: true
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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

fullScreenSwitch(document, canvas)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
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

    // Update particles
    particles.rotation.y = elapsedTime * 0.2
    particles.rotation.x = elapsedTime * 0.2
    particles.rotation.z = elapsedTime * 0.2

    // Update controls
    controls.update()

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