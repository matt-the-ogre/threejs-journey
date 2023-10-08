import * as THREE from 'three'

// Cursor
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
    // console.log(cursor.x.toFixed(3), cursor.y.toFixed(3))
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)
// Axes helper
const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)

// Camera
// 75 is the vertical field of view, in degrees
// sizes.width / sizes.height is the aspect ratio
// 1 is the near clipping plane
// 1000 is the far clipping plane
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
// left, right, top, bottom, near, far
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     1,
//     -1,
//     0.1,
//     100
// )
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

// FPS Variables
let lastTime = performance.now();
let frameCount = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;
    // mesh.position.x = Math.cos(elapsedTime);
    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.rotation.x = elapsedTime;
    // camera.fov = 45 + 25 * Math.sin(elapsedTime);

    // Update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.y = cursor.y * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    camera.lookAt(mesh.position)

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
        document.getElementById("fps").innerText = `${frameCount} FPS ${(1000/lastRenderTime).toFixed(2)} fps ${lastRenderTime.toFixed(2)} ms\n${cursor.x.toFixed(3)}, ${cursor.y.toFixed(3)}`;
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()