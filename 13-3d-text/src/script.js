import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

// Fonts
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // console.log('font loaded')
        const myBevelSize = 0.02
        const myBevelThickness = 0.03
        const textGeometry = new TextGeometry(
            'Lorem ipsum',
            {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 50,
                bevelEnabled: true,
                bevelThickness: myBevelThickness,
                bevelSize: myBevelSize,
                bevelOffset: 0,
                bevelSegments: 40
            }
        )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
        // center the text
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - myBevelSize) / 2,
        //     - (textGeometry.boundingBox.max.y - myBevelSize) / 2,
        //     - (textGeometry.boundingBox.max.z - myBevelThickness) / 2
        // )
        textGeometry.center()
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
        // Physical material
        /*
        const textMaterial = new THREE.MeshPhysicalMaterial()
        textMaterial.color = new THREE.Color(0xff0000)
        textMaterial.metalness = 0.3
        textMaterial.roughness = 0.4
        */ 
        // matcap material
        const textMaterial = new THREE.MeshMatcapMaterial( {matcap: matcapTexture} )
        
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        console.time('donuts')

        // create 100 donuts with the same geometry and material in random positions up to 10 units away from the center and random sizes between 0.5 and 1.5 and random rotations
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
        console.timeEnd('donuts')
    }
);


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, 0)
scene.add(directionalLight)

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
let lastTickTime = clock.getElapsedTime()
let thisTickTime = lastTickTime

// FPS Variables
let lastTime = performance.now();
let frameCount = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // rotate the donuts slowly in two dimensions
    let deltaTickTime = elapsedTime - lastTickTime
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name !== 'text') {
            // console.log(child.name)
            child.rotation.x += deltaTickTime * 0.1
            child.rotation.y += deltaTickTime * 0.1
        }
    })
    lastTickTime = elapsedTime

    
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