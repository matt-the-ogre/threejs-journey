import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui';

THREE.ColorManagement.enabled = false

// lil-gui
const gui = new lil.GUI();
const materialGUIFolder = gui.addFolder('Material');

// Load the textures
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
// const environmentMapTexture = textureLoader.load('/textures/environmentMaps/3/');

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg',
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

/* 
const material = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
});
// material.wireframe = true;
material.opacity = 0.5;
material.transparent = true;
material.alphaMap = doorAlphaTexture;
material.side = THREE.DoubleSide;
// next lines are redundant; just including for reference
material.map = doorColorTexture;
material.color = new THREE.Color(0x00ff00);
// or
material.color.set('yellow');
*/ 

/*
const material = new THREE.MeshNormalMaterial();
material.side = THREE.DoubleSide;
// material.flatShading = true;
*/

/*
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
material.side = THREE.DoubleSide;
material.transparent = true;
material.opacity = 0.5;
*/

/*
const material = new THREE.MeshDepthMaterial();
material.side = THREE.DoubleSide;
*/

// const material = new THREE.MeshLambertMaterial();

/*
const material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);
*/

/*
const material = new THREE.MeshToonMaterial();
material.gradientMap = gradientTexture;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
*/

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0.7;
material.roughness = 0.1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.alphaMap = doorAlphaTexture;
material.envMap = environmentMapTexture;
material.transparent = true;

// leave this on for the plane to show
material.side = THREE.DoubleSide;

materialGUIFolder.add(material, 'metalness').min(0).max(1).step(0.0001);
materialGUIFolder.add(material, 'roughness').min(0).max(1).step(0.0001);
materialGUIFolder.add(material, 'wireframe');
materialGUIFolder.add(material, 'flatShading');
materialGUIFolder.add(material, 'transparent');
materialGUIFolder.add(material, 'opacity').min(0).max(1).step(0.0001);
materialGUIFolder.add(material, 'visible');
materialGUIFolder.add(material, 'side', {
    Front: THREE.FrontSide,
    Back: THREE.BackSide,
    Double: THREE.DoubleSide
}).onFinishChange(() => {
    material.needsUpdate = true;
});
// materialGUIFolder.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
// materialGUIFolder.add(material, 'displacementScale').min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
);
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 10, 10),
    material
);
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);
scene.add(sphere, plane, torus);
sphere.position.x = -1.5;
torus.position.x = 1.5;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2,3,4);
scene.add(pointLight);

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
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

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