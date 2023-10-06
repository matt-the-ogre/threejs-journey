// console.log(THREE)
const scene = new THREE.Scene()

// create a cube and make it red
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

const mesh = new THREE.Mesh(geometry, material)

// add it to the scene
scene.add(mesh)

// create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

scene.add(camera)