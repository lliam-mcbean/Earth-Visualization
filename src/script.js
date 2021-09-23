import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI()
var guiVariables = {
    displacement: 0.1
}
  
gui.add(guiVariables, 'displacement').min(0).max(1)

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
        displacementScale: guiVariables.displacement,
        map: earthTexture
    })
)
scene.add(earth)

const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(3.05, 700, 700),
    new THREE.MeshStandardMaterial({
        transparent: true,
        color: 0xffffff,
        alphaMap: cloudsTreansparency
    })
)
scene.add(clouds)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

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
camera.position.set(- 3, 3, 3)
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