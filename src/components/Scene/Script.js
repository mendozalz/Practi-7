import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

//Global variables
let currentRef = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
cube.name = "cubo#1";
scene.add(cube);

//cube#2
const cube2 = cube.clone();
const cube2Material = new THREE.MeshBasicMaterial();
cube2.material = cube2Material;
cube2.name = "cubo#2";
cube2.position.set(-2, 0, 0);
scene.add(cube2);

//cube#3
const cube3 = cube.clone();
const cube3Material = new THREE.MeshBasicMaterial();
cube3.material = cube3Material;
cube3.name = "cubo#3";
cube3.position.set(2, 0, 0);
scene.add(cube3);

// Raycaster

const raycaster = new THREE.Raycaster();

// Get mouse course
const pointer = new THREE.Vector2(-100, -100);

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("pointermove", onPointerMove);

// Animacion Hover reset
let meshcurrentHover = null;

// handleMesh click
let meshClick = null;
const handleClick = () => {
  try {
    if (meshClick) { // Verifica si meshClick no es null
      switch (meshClick.name) {
        case "cubo#1":
          return console.log("click en cubo #1");
        case "cubo#2":
          return console.log("click en cubo #2");
        case "cubo#3":
          return console.log("click en cubo #3");
        default:
          return null;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
window.addEventListener("click", handleClick);

const objectCollitions = () =>{
  return [cube2, cube3]
}

//Animate the scene
const animate = () => {
  // Intersectando con el raycaster colisiones
  raycaster.setFromCamera(pointer, camera);
  const collitions = objectCollitions()
  const intersec = raycaster.intersectObjects(collitions);

  // Mouse Leave para reforzar que el comportamiento sea el adecuado
  if (meshcurrentHover) {
    gsap.to(meshcurrentHover.material.color, {
      r: 1,
      g: 1,
      b: 1,
      overwrite: true,
      duration: 0.5,
    });
  }

  // Mouse HOVER and CLICK
  if (intersec.length) {
    meshcurrentHover = null;
    meshcurrentHover = intersec[0].object
    meshClick = intersec[0].object
    gsap.to(meshcurrentHover.material.color, {
      r: 1,
      g: 0,
      b: 0,
      overwrite: true,
      duration: 0.3,
    });
  } else if (meshcurrentHover) {
    gsap.to(meshcurrentHover.material.color, {
      r: 1,
      g: 1,
      b: 1,
      overwrite: true,
      duration: 0.5,
    });
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.dispose();
  currentRef.removeChild(renderer.domElement);
};
