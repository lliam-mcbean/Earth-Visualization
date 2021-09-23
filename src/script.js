import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// Location Data
const vancouver = { 
    lat: 49.2827,
    long: 123.1207
}

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const earthTexture = textureLoader.load('/textures/earthmap.jpg')
const earthDisplacement = textureLoader.load('/textures/occulantearth.jpg')
const earthAmbient = textureLoader.load('/textures/occulantearth.jpg')

const cloudsTexture = textureLoader.load('/textures/clouds.jpg')
const cloudsTreansparency = textureLoader.load('/textures/fairweather.jpeg')

/**
 * Test sphere
 */
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(3, 700, 700),
    new THREE.MeshStandardMaterial({
        normalMap: earthAmbient,
        displacementMap: earthDisplacement,
        displacementScale: 0.1,
        map: earthTexture
    })
)
earth.rotation.y =  - Math.PI / 2
earth.recieveShadow = true
gui.add(earth.material, 'displacementScale').min(0).max(1)
scene.add(earth)

const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(3.05, 700, 700),
    new THREE.MeshStandardMaterial({
        transparent: true,
        color: 0xffffff,
        alphaMap: cloudsTreansparency
    })
)
clouds.castShadow = true
scene.add(clouds)

let x = Math.cos(vancouver.lat) * Math.cos(vancouver.long) * 3
let y = Math.cos(vancouver.lat) * Math.sin(vancouver.long) * 3
let z = Math.sin(vancouver.lat) * 3

const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    })
)
point.position.x = x
point.position.y = y
point.position.z = z
scene.add(point)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

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
camera.position.z = 5
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    clouds.rotation.y = elapsedTime / 40
    clouds.rotation.x = Math.sin(elapsedTime / 30)

    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()