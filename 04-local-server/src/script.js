import * as THREE from 'three';

// Scene
const scene = new THREE.Scene()

// create a cube and make it red
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

const mesh = new THREE.Mesh(geometry, material)

// add it to the scene
scene.add(mesh)

// create a camera
const fieldOfView = 75
const aspectRatio = window.innerWidth / window.innerHeight
// const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, 0.1, 1000)
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio)

// move the camera back so we can see the cube
camera.position.z = 3
// camera.position.x = 1
// camera.position.y = 1
scene.add(camera)

// Renderer
const canvas = document.querySelector('canvas.webgl')
// console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.render(scene, camera)
