import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.z = 100
camera.position.y = 5

let loader = new THREE.TextureLoader()
let cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath("/cubeTexture/")

let sunTexture = loader.load("/sun.jpg")
let geometry = new THREE.SphereGeometry(1, 32, 32)
let sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture})
let sun = new THREE.Mesh(geometry, sunMaterial)
sun.scale.set(5, 5, 5)
scene.add(sun)

//textures
let mercuryTexture = loader.load("/mercury.jpg")
let venusTexture = loader.load("/venus.jpg")
let earthTexture = loader.load("/earth.jpg")
let marsTexture = loader.load("/mars.jpg")
let jupiterTexture = loader.load("/jupiter.jpg")
let saturnTexture = loader.load("/saturn.jpg")
let neptuneTexture = loader.load("/neptune.jpg")
let uranusTexture = loader.load("/uranus.jpg")
let moonTexture = loader.load("/moon.jpg")
let tritonTexture = loader.load("/triton.jpg")

let mercuryMaterial = new THREE.MeshStandardMaterial({map: mercuryTexture})
let venusMaterial = new THREE.MeshStandardMaterial({map: venusTexture})
let earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture})
let marsMaterial = new THREE.MeshStandardMaterial({map: marsTexture})
let jupiterMaterial = new THREE.MeshStandardMaterial({map: jupiterTexture})
let saturnMaterial = new THREE.MeshStandardMaterial({map: saturnTexture})
let uranusMaterial = new THREE.MeshStandardMaterial({map: uranusTexture})
let neptuneMaterial = new THREE.MeshStandardMaterial({map: neptuneTexture})
let moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture})
let tritonMaterial = new THREE.MeshStandardMaterial({map: tritonTexture})

console.log(cubeTextureLoader)
let background = cubeTextureLoader.load([
	'px.png',
	'nx.png',
	'py.png',
	'ny.png',
	'pz.png',
	'nz.png'
]);
console.log(background)
scene.background = background
let planet = [
  {
    name: "mercury",
    radius: 0.38,              // relative to sun scale (5)
    distance: 8,               // from sun
    speed: 0.02,               // orbital speed
    material: mercuryMaterial,
    moons: []
  },
  {
    name: "venus",
    radius: 0.95,
    distance: 11,
    speed: 0.015,
    material: venusMaterial,
    moons: []
  },
  {
    name: "earth",
    radius: 1,
    distance: 14,
    speed: 0.01,
    material: earthMaterial,
    moons: [
      {
        name: "moon",
        radius: 0.27,         // relative to Earth
        distance: 2,          // distance from Earth
        speed: 0.05,
        material: moonMaterial
      }
    ]
  },
  {
    name: "mars",
    radius: 0.53,
    distance: 18,
    speed: 0.008,
    material: marsMaterial,
    moons: [
      {
        name: "phobos",
        radius: 0.1,
        distance: 1.5,
        speed: 0.06,
        material: moonMaterial
      },
      {
        name: "deimos",
        radius: 0.06,
        distance: 2.2,
        speed: 0.045,
        material: moonMaterial
      }
    ]
  },
  {
    name: "jupiter",
    radius: 2.5,
    distance: 24,
    speed: 0.004,
    material: jupiterMaterial,
    moons: []
  },
  {
    name: "saturn",
    radius: 2.1,
    distance: 30,
    speed: 0.003,
    material: saturnMaterial,
    moons: []
  },
  {
    name: "uranus",
    radius: 1.6,
    distance: 36,
    speed: 0.002,
    material: uranusMaterial,
    moons: [
        {
        name: "titania",
        radius: 0.4,
        distance: 3,
        speed: 0.03,
        material: moonMaterial
      }
    ]
  },
  {
    name: "neptune",
    radius: 1.5,
    distance: 40,
    speed: 0.0015,
    material: neptuneMaterial,
    moons: [
        {
        name: "triton",
        radius: 0.40,
        distance: 2,
        speed: 0.02,
        material: tritonMaterial
      }
    ]
  }
];

let planetMeshes = planet.map((planet)=>{
    let mesh = new THREE.Mesh(geometry, planet.material)
    mesh.position.x = planet.distance
    mesh.scale.setScalar(planet.radius)
    planet.moons.forEach((moon)=>{
        let moonMesh = new THREE.Mesh(geometry, moon.material)
        moonMesh.scale.setScalar(moon.radius)
        moonMesh.position.x = moon.distance
        mesh.add(moonMesh)
    })
    scene.add(mesh)
    return mesh
})

let ambientLight = new THREE.AmbientLight("white", 0.1)
scene.add(ambientLight)
let pointLight = new THREE.PointLight("white", 100)
pointLight.position.set(0, 0, 0);
scene.add(pointLight)

let canvas = document.querySelector("canvas")
let renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
window.addEventListener("resize", ()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
const controls = new OrbitControls( camera, canvas );

let clock = new THREE.Clock()
function animate() {
    let elapsedTime = clock.getElapsedTime()
    planetMeshes.forEach((planetMesh, index)=>{
        planetMesh.rotation.y += planet[index].speed
        planetMesh.position.x = Math.sin(planetMesh.rotation.y) * planet[index].distance
        planetMesh.position.z = Math.cos(planetMesh.rotation.y) * planet[index].distance
        planetMesh.children.forEach((moon, moonindex)=>{
            moon.rotation.y += planet[index].moons[moonindex].speed
            moon.position.x = Math.sin(moon.rotation.y) * planet[index].moons[moonindex].distance
            moon.position.z = Math.cos(moon.rotation.y) * planet[index].moons[moonindex].distance
        })
    })
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()