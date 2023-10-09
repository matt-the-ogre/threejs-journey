import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return parseInt(color, 16);
}
const randomColor = getRandomColor();

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: randomColor })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
}
)

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if(!fullscreenElement) {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen();
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen();
        }
    }
    else {
        if(document.exitFullscreen)
            document.exitFullscreen();
        else if(document.webkitExitFullscreen)
            document.webkitExitFullscreen();
    }
}
)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)

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

    mesh.rotation.y = Math.sin(elapsedTime)
    
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
    // only update every second (1000 milliseconds)
    if (performanceTime >= lastTime + 1000) {
        document.getElementById("fps").innerText = `${frameCount} FPS ${(1000/lastRenderTime).toFixed(2)} fps ${lastRenderTime.toFixed(2)} ms`;
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()