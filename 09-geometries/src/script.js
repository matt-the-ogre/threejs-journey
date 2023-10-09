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

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: randomColor })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Array to hold cubes
const objects = [];
const numObjects = 500;
const maxSize = 0.4
const minSize = 0.1
// Generate n cubes
for (let i = 0; i < numObjects; i++) {
    const size = Math.random() * (maxSize - minSize) + minSize; // Random size between 0.1 and 2.0
    let geometry = new THREE.BoxGeometry(size, size, size);
    const randomGeometry = Math.floor(Math.random() * 7);
    // console.log(randomGeometry)
    switch(randomGeometry) {
        case 0:
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case 1:
            geometry = new THREE.ConeGeometry(size, size, 32);
            break;
        case 2:
            geometry = new THREE.CylinderGeometry(size, size, size);
            break;
        case 3:
            geometry = new THREE.DodecahedronGeometry(size, 0);
            break;
        case 4:
            geometry = new THREE.IcosahedronGeometry(size);
            break;
        case 5:
            geometry = new THREE.OctahedronGeometry(size, 0);
            break;
        case 6:
            geometry = new THREE.TetrahedronGeometry(size);
            break;
        default:
            geometry = new THREE.SphereGeometry(size);
            break;
    }
    const material = new THREE.MeshStandardMaterial({ color: getRandomColor() });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.random() * 10 - 5; // Random x position between -5 and 5
    cube.position.y = Math.random() * 10 - 5; // Random y position between -5 and 5
    cube.position.z = Math.random() * 10 - 5; // Random z position between -5 and 5
    cube.rotation.x = Math.random() * 2 * Math.PI;
    cube.rotation.y = Math.random() * 2 * Math.PI;
    cube.rotation.z = Math.random() * 2 * Math.PI;

    objects.push(cube);
    scene.add(cube);
}

const geometry2 = new THREE.BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for(let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 8;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry2.setAttribute('position', positionsAttribute);
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh2 = new THREE.Mesh(geometry2, material2);
scene.add(mesh2);

let triangleCount = 0;

scene.traverse((object) => {
  if (object instanceof THREE.Mesh) {
    const geometry = object.geometry;
    
    if (geometry instanceof THREE.BufferGeometry && geometry.index !== null) {
      triangleCount += geometry.index.count / 3;
    }
    // else if (geometry instanceof THREE.Geometry) {
    //   triangleCount += geometry.faces.length;
    // }
  }
});

// console.log("Total number of triangles: ", triangleCount);

// Sizes
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

// Lights

const light1 = new THREE.PointLight(0x99ffff, 1, 100);
light1.position.set(20, 20, 20);
scene.add(light1);
const light2 = new THREE.PointLight(0xff99ff, 1, 100);
light2.position.set(20, 20, -20);
scene.add(light2);
const light3 = new THREE.PointLight(0xffff99, 1, 100);
light3.position.set(20, -20, 20);
scene.add(light3);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

// FPS Variables
let lastTime = performance.now();
let frameCount = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

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
        document.getElementById("fps").innerText = `${frameCount} FPS ${(1000/lastRenderTime).toFixed(2)} fps ${lastRenderTime.toFixed(2)} ms\ntriangles: ${triangleCount}`;
        frameCount = 0;
        lastTime = performanceTime;
    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()