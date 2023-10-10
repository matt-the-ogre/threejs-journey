import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('start')
};
loadingManager.onLoad = () => {
    console.log('load')
};
loadingManager.onProgress = () => {
    console.log('progress')
};
loadingManager.onError = () => {
    console.log('error')
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const checkboardTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
const minecraftTexture = textureLoader.load('/textures/minecraft.png');

// colorTexture.generateMipmaps = false;
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.NearestFilter;
minecraftTexture.magFilter = THREE.NearestFilter;
minecraftTexture.minFilter = THREE.NearestFilter;
minecraftTexture.generateMipmaps = false;

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

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1, 27, 27, 27)
const material = new THREE.MeshStandardMaterial(
    {
        map: colorTexture,
        alphaMap: alphaTexture,
        displacementMap: heightTexture,
        displacementScale: 0.05,
        normalMap: normalTexture,
        aoMap: ambientOcclusionTexture,
        metalnessMap: metalnessTexture,
        roughnessMap: roughnessTexture
    }
)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(1,0,0)
// mesh.position.set(0,0,0)
// scene.add(mesh)
    
// Sphere
const earthColorTexture = textureLoader.load('/textures/2_no_clouds_1k.jpg');
const earthHeightTexture = textureLoader.load('/textures/elev_bump_1k.jpg');
const earthSpecularTexture = textureLoader.load('/textures/water_1k.png');
// const earthNormalTexture = textureLoader.load('/textures/elev_bump_1k.jpg');
const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
// create the sphere material so the specular map creates a shine
const sphereMaterial = new THREE.MeshPhongMaterial(
    {
        // color: 0xffffff,
        map: earthColorTexture,
        displacementMap: earthHeightTexture,
        displacementScale: 0.02,
        specularMap: earthSpecularTexture,
        // metalnessMap: earthSpecularTexture,
        // normalMap: earthNormalTexture
    }
);
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 0, 0);
scene.add(sphereMesh);

// Clouds layer on a slightly larger sphere
const earthCloudsTexture = textureLoader.load('/textures/fair_clouds_1k.png');
const earthCloudsGeometry = new THREE.SphereGeometry(0.51, 64, 64);
const earthCloudsMaterial = new THREE.MeshPhongMaterial(
    {
        map: earthCloudsTexture,
        transparent: true
    }
);
const earthCloudsMesh = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
earthCloudsMesh.position.set(0, 0, 0);
scene.add(earthCloudsMesh);

// Starfield
const starfieldTexture = textureLoader.load('/textures/starfield_1k.jpg');
starfieldTexture.generateMipmaps = false;
starfieldTexture.minFilter = THREE.NearestFilter;
starfieldTexture.magFilter = THREE.NearestFilter;
// repeat the texture 5 times in both directions
starfieldTexture.repeat.set(5, 5);
starfieldTexture.wrapS = THREE.RepeatWrapping;
starfieldTexture.wrapT = THREE.RepeatWrapping;
// move the texture 0.5 in both directions
starfieldTexture.offset.set(0.5, 0.5);
const starfieldGeometry = new THREE.SphereGeometry(100, 64, 64);
const starfieldMaterial = new THREE.MeshBasicMaterial(
    {
        map: starfieldTexture,
        side: THREE.BackSide
    }
);
const starfieldMesh = new THREE.Mesh(starfieldGeometry, starfieldMaterial);
starfieldMesh.position.set(0, 0, 0);
scene.add(starfieldMesh);

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

scene.add(new THREE.AmbientLight(0xffffff, 0.1));  // soft white light

const light1 = new THREE.PointLight(0x99ffff, 1, 100);
light1.position.set(10, 0, 10);
scene.add(light1);
const coneLight1Geometry = new THREE.ConeGeometry(0.1, 0.1, 4);
const coneLight1Material = new THREE.MeshBasicMaterial({ color: 0x99ffff });
const coneLight1 = new THREE.Mesh(coneLight1Geometry, coneLight1Material);
coneLight1.position.set(10, 0, 10);
scene.add(coneLight1);

// const light2 = new THREE.PointLight(0xff99ff, 1, 100);
// light2.position.set(10, 10, -10);
// scene.add(light2);

// const light3 = new THREE.PointLight(0xffff99, 1, 100);
// light3.position.set(10, -10, 10);
// scene.add(light3);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 200)
camera.position.set(0,0,3)
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

    // Update controls
    controls.update()

    // rotate mesh with gsap
    // gsap.to(mesh.rotation, { x: elapsedTime / 2 , y: elapsedTime / 3 })
    gsap.to(sphereMesh.rotation, { y: elapsedTime / 3 })
    gsap.to(earthCloudsMesh.rotation, { y: elapsedTime / 2.9 })

    // move light1 in a circle around the mesh using gsap
    gsap.to(light1.position, { x: Math.cos(elapsedTime) * 10, z: Math.sin(elapsedTime) * 10 })
    gsap.to(coneLight1.position, { x: Math.cos(elapsedTime) * 10, z: Math.sin(elapsedTime) * 10 })

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