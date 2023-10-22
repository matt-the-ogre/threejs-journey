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
    myRenderTime: 0,
    myTriangles: 0,
    myGeometries: 0,
}
const debugFolder = gui.addFolder('Debug')
const myFPSScreenController = debugFolder.add(debugObject, 'myFPSScreen').name('screen FPS')
const myFPSRenderController = debugFolder.add(debugObject, 'myFPSRender').name('render FPS')
const myRenderTimeController = debugFolder.add(debugObject, 'myRenderTime').name('render time (ms)')
const myTrianglesController = debugFolder.add(debugObject, 'myTriangles').name('Triangles')
const myGeometriesController = debugFolder.add(debugObject, 'myGeometries').name('Geometries')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/3.png') 

/**
 * Particles
*/

// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
// const particlesGeometry = new THREE.ConeGeometry(1, 1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()
// create 500 geometries for particles
const count = 200000
// a position array with 3 values for each vertex
const positions = new Float32Array(count * 3)
// a color array with 3 values for each vertex
const colors = new Float32Array(count * 3)
// fill the arrays with random values
for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    // set a random colour for each vertex
    colors[i] = Math.random()
}
// set the attributes of the geometry
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    // color: '#ff88cc',
    alphaMap: particleTexture,
    transparent: true,
    alphaTest: 0.001, // if alpha is less than 0.001, it will be discarded
    depthWrite: false, 
    blending: THREE.AdditiveBlending,
    vertexColors: true
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
    // this rotates the entire particles geometry, not individual particles
    // particles.rotation.y = elapsedTime * 0.02
    // particles.rotation.x = elapsedTime * 0.02
    // particles.rotation.z = elapsedTime * 0.2
    // this goes through the particles positions array and updates each selectively
    particlesGeometry.attributes.position.array.forEach((position, index) => {
        // if the index is divisible by 3, it's the x position
        if(index % 3 === 0){
            let x = particlesGeometry.attributes.position.array[index]
            particlesGeometry.attributes.position.array[index + 1] = Math.cos(elapsedTime + x)
            // according to the lesson this is not a good way to do this
        }
    })
    // this tells three.js that the positions have been updated
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    const renderStartTime = performance.now();
    renderer.render(scene, camera)
    const renderEndTime = performance.now();
    const lastRenderTime = renderEndTime - renderStartTime;
    // console.log(lastRenderTime);

    // Calculate FPS
    const performanceTime = performance.now();
    frameCount++;
    // only update four times every second (250 milliseconds between updates))
    const updatems = 250;
    if (performanceTime >= lastTime + updatems) {
        const framesPerSecondActual = frameCount*(1000/updatems)
        debugObject.myFPSScreen = framesPerSecondActual;
        debugObject.myFPSRender = (1000/lastRenderTime).toFixed(0);
        debugObject.myRenderTime = lastRenderTime.toFixed(2);
        debugObject.myTriangles = renderer.info.render.triangles;
        debugObject.myGeometries = renderer.info.memory.geometries;
        myFPSScreenController.updateDisplay();
        myFPSRenderController.updateDisplay();
        myRenderTimeController.updateDisplay();
        myTrianglesController.updateDisplay();
        myGeometriesController.updateDisplay();
        
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()