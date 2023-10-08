import * as THREE from 'three'
import gsap from `gsap`

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animations
// FPS Variables
let lastTime = performance.now();
let frameCount = 0;

// Clock
const clock = new THREE.Clock()

const tick = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime()
    // console.log(elapsedTime)

    // console.log('tick')
    // Update objects
    mesh.rotation.y = elapsedTime * Math.PI * 1;
    mesh.rotation.x = elapsedTime * Math.PI * 0.5;
    mesh.position.y = Math.sin(elapsedTime);
    mesh.position.x = Math.cos(elapsedTime);
    mesh.position.z = Math.sin(elapsedTime) * Math.cos(elapsedTime);

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
