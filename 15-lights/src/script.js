import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)
ambientLight.visible = false
const ambientLightGUIFolder = gui.addFolder('ambientLight')
ambientLightGUIFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.1)
ambientLightGUIFolder.add(ambientLight, 'visible')

const directionalLight = new THREE.DirectionalLight(0x0000ff, 0.5)
directionalLight.position.set(2, 2, - 1)
directionalLight.visible = false
scene.add(directionalLight)
const directionalLightGUIFolder = gui.addFolder('directionalLight')
directionalLightGUIFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01)
// gui.add(directionalLight, 'color')
directionalLightGUIFolder.add(directionalLight.position, 'x').min(- 5).max(5).step(0.01)
directionalLightGUIFolder.add(directionalLight.position, 'y').min(- 5).max(5).step(0.01)
directionalLightGUIFolder.add(directionalLight.position, 'z').min(- 5).max(5).step(0.01)
directionalLightGUIFolder.add(directionalLight, 'visible')

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5)
scene.add(hemisphereLight)
hemisphereLight.visible = false
const hemisphereLightGUIFolder = gui.addFolder('hemisphereLight')
hemisphereLightGUIFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01)
hemisphereLightGUIFolder.add(hemisphereLight, 'visible')

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.set(2, 3, 4)
pointLight.distance = 10
scene.add(pointLight)
const pointLightGUIFolder = gui.addFolder('pointLight')
pointLightGUIFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01)
pointLightGUIFolder.add(pointLight.position, 'x').min(- 15).max(15).step(0.1)
pointLightGUIFolder.add(pointLight.position, 'y').min(- 15).max(15).step(0.1)
pointLightGUIFolder.add(pointLight.position, 'z').min(- 15).max(15).step(0.1)
pointLightGUIFolder.add(pointLight, 'visible')

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 0.9, 1, 1)
rectAreaLight.position.set(0.5, .20, 1.2)
// console.log(rectAreaLight.position)
rectAreaLight.lookAt(new THREE.Vector3())
rectAreaLight.visible = true
scene.add(rectAreaLight)
const rectAreaLightGUIFolder = gui.addFolder('rectAreaLight')
rectAreaLightGUIFolder.add(rectAreaLight, 'intensity').min(0).max(1).step(0.1)
rectAreaLightGUIFolder.add(rectAreaLight, 'width').min(0).max(5).step(0.1)
rectAreaLightGUIFolder.add(rectAreaLight, 'height').min(0).max(5).step(0.1)
rectAreaLightGUIFolder.addColor(rectAreaLight, 'color').onChange(() => {
    rectAreaLightGUIFolder.color.set(rectAreaLightGUIFolder.color);
}
)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/*
// Create the geometry for the box, using the width and height of the RectAreaLight
const geometry = new THREE.BoxGeometry(rectAreaLight.width, rectAreaLight.height, 0.05);

// Create the material, set its transparency to 50%
const materialBasic = new THREE.MeshBasicMaterial({ 
  color: 0x4e00ff, 
  opacity: 0.5, 
  transparent: true 
});

// Create the mesh
const RectAreaLightBox = new THREE.Mesh(geometry, materialBasic);

// Position and orientation should match the RectAreaLight
RectAreaLightBox.position.copy(rectAreaLight.position);
RectAreaLightBox.rotation.copy(rectAreaLight.rotation);

// Add it to the scene
scene.add(RectAreaLightBox);

// If you want to make it a child of the light
// rectAreaLight.add(RectAreaLightBox);

// const rectAreaLightHelper = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, .1),
//     new THREE.MeshBasicMaterial()
// )
// rectAreaLightHelper.material.color = rectAreaLight.color
// rectAreaLightHelper.material.transparent = true
// rectAreaLightHelper.material.opacity = 0.5
// rectAreaLightHelper.position.set(0.5, .20, 1.2)
// rectAreaLightHelper.lookAt(new THREE.Vector3())
// scene.add(rectAreaLightHelper)
*/ 

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = - 0.75
spotLight.visible = true
const spotLightGUIFolder = gui.addFolder('spotLight')
spotLightGUIFolder.add(spotLight, 'visible')
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
    spotLightHelper.update()
    spotLightHelper.visible = spotLight.visible
}
)

/*
// Assume `spotLight` is your THREE.SpotLight object
// const spotLight = new THREE.SpotLight(0xffffff, 1);
// spotLight.angle = Math.PI / 4;
// spotLight.position.set(0, 5, 0);
// spotLight.target.position.set(0, 0, 0);

// Create the geometry for the cone
const coneHeight = 0.5;  // Set this to be the distance over which the spotlight has an effect
const geometryCone = new THREE.ConeGeometry(Math.tan(spotLight.angle) * coneHeight, coneHeight);

// Create the material, set its transparency to 50%
const materialBasicSpot = new THREE.MeshBasicMaterial({
  color: 0x78ff00,
  opacity: 0.5,
  transparent: true
});

// Create the mesh for the cone
const cone = new THREE.Mesh(geometryCone, materialBasicSpot);

// Position and orientation should match the SpotLight
cone.position.copy(spotLight.position);
cone.lookAt(spotLight.target.position);

// Add them to the scene
scene.add(cone);


// If you want to make them children of the light
// spotLight.add(cone);
// spotLight.add(box);
*/ 

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return parseInt(color, 16);
}
// a function to add a torus to the scene in a random position with a random material color

function addRandomTorus() {
    const randomTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        new THREE.MeshStandardMaterial({ color: getRandomColor() })
    )
    randomTorus.position.x = (Math.random() - 0.5) * 10
    randomTorus.position.y = (Math.random() - 0.5) * 10
    randomTorus.position.z = (Math.random() - 0.5) * 10
    scene.add(randomTorus)
}

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.z = 4
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // rotate the rectAreaLight in a circle around the origin
    rectAreaLight.position.x = 2 * Math.sin(elapsedTime)
    rectAreaLight.position.z = 2 * Math.cos(elapsedTime)
    rectAreaLight.lookAt(new THREE.Vector3())

    // rotate the spotLight in a circle around the origin
    spotLight.position.x = 2 * Math.sin(elapsedTime)
    spotLight.position.z = 2 * Math.cos(elapsedTime)
    spotLight.lookAt(new THREE.Vector3())

    // rotate the pointLight in a circle around the origin
    pointLight.position.x = 2 * Math.sin(elapsedTime)
    pointLight.position.z = 2 * Math.cos(elapsedTime)
    pointLight.lookAt(new THREE.Vector3())

    // Update controls
    controls.update()

    // count the visible lights
    let visibleLights = 0
    scene.traverse(child => {
        if (child instanceof THREE.Light && child.visible) {
            visibleLights++
        }
    })

    // Render
    const renderStartTime = performance.now();
    renderer.render(scene, camera)
    const renderEndTime = performance.now();
    const lastRenderTime = renderEndTime - renderStartTime;

    // Calculate FPS
    const performanceTime = performance.now();
    frameCount++;
    // only update twice every second (500 milliseconds)
    const updatems = 500;
    if (performanceTime >= lastTime + updatems) {
        const framesPerSecondActual = frameCount*(1000/updatems)
        // if frames per second actual is above 59, add a random torus
        if (framesPerSecondActual > 59) {
            addRandomTorus()
        }
        document.getElementById("fps").innerText = `${framesPerSecondActual} FPS ${(1000/lastRenderTime).toFixed(2)} fps ${lastRenderTime.toFixed(2)} ms\ntriangles: ${renderer.info.render.triangles} lights: ${visibleLights}`;
        frameCount = 0;
        lastTime = performanceTime;
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()