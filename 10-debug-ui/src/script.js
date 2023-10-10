import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'

// **
//  * Debug
//  */
const gui = new lil.GUI({ closed : true })


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

const geometry = new THREE.BoxGeometry(1, 1, 1, 30, 30, 30)
const material = new THREE.MeshStandardMaterial({ color: getRandomColor() })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
const meshFolder = gui.addFolder('mesh')
meshFolder.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x')
meshFolder.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y')
meshFolder.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('z')
meshFolder.add(mesh, 'visible')
meshFolder.add(material, 'wireframe')
meshFolder.addColor(material, 'color').onChange(() => {
    material.color.set(material.color);
})
meshFolder.add(mesh.rotation, 'x').min(0).max(2 * Math.PI).step(0.01).name('rotationX')
meshFolder.add(mesh.rotation, 'y').min(0).max(2 * Math.PI).step(0.01).name('rotationY')
meshFolder.add(mesh.rotation, 'z').min(0).max(2 * Math.PI).step(0.01).name('rotationZ')
meshFolder.add(mesh.scale, 'x').min(0.1).max(2).step(0.01).name('scaleX')
meshFolder.add(mesh.scale, 'y').min(0.1).max(2).step(0.01).name('scaleY')
meshFolder.add(mesh.scale, 'z').min(0.1).max(2).step(0.01).name('scaleZ')

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

// Lights

const light1 = new THREE.PointLight(0x99ffff, 1, 100);
light1.position.set(20, 20, 20);
scene.add(light1);
const light1Folder = gui.addFolder('light1')
light1Folder.add(light1.position, 'x').min(-3).max(3).step(0.01).name('light1X')
light1Folder.add(light1.position, 'y').min(-3).max(3).step(0.01).name('light1Y')
light1Folder.add(light1.position, 'z').min(-3).max(3).step(0.01).name('light1Z')
light1Folder.add(light1, 'visible')
light1Folder.add(light1, 'intensity').min(0).max(10).step(0.01).name('light1Intensity')
light1Folder.addColor(light1, 'color').onChange(() => {
    light1.color.set(light1.color);
}
)
const light2 = new THREE.PointLight(0xff99ff, 1, 100);
light2.position.set(20, 20, -20);
scene.add(light2);
const light2Folder = gui.addFolder('light2')
light2Folder.add(light2.position, 'x').min(-3).max(3).step(0.01).name('light1X')
light2Folder.add(light2.position, 'y').min(-3).max(3).step(0.01).name('light1Y')
light2Folder.add(light2.position, 'z').min(-3).max(3).step(0.01).name('light1Z')
light2Folder.add(light2, 'visible')
light2Folder.add(light2, 'intensity').min(0).max(10).step(0.01).name('light1Intensity')
light2Folder.addColor(light2, 'color').onChange(() => {
    light2.color.set(light2.color);
}
)
const light3 = new THREE.PointLight(0xffff99, 1, 100);
light3.position.set(20, -20, 20);
scene.add(light3);

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

    // Update controls
    controls.update()

    // Update objects
    mesh.rotation.y = elapsedTime * Math.PI * 0.1

    // Render
    const renderStartTime = performance.now();
    renderer.render(scene, camera)
    const renderEndTime = performance.now();
    const lastRenderTime = renderEndTime - renderStartTime;
    // Calculate FPS
    const performanceTime = performance.now();
    frameCount++;
    // only update every second (1000 milliseconds)
    const updatems = 500;
    if (performanceTime >= lastTime + updatems) {
        document.getElementById("fps").innerText = `${frameCount*(1000/updatems)} FPS ${(1000/lastRenderTime).toFixed(2)} fps ${lastRenderTime.toFixed(2)} ms\ntriangles: ${renderer.info.render.triangles}`;
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()