import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);

renderer.render(scene, camera);

// Moon texture from PolyHaven
// https://polyhaven.com/a/rocks_ground_04
const texture = new THREE.TextureLoader().load("./moon.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(2, 2);

const NormalTexture = new THREE.TextureLoader().load("./moon_normal.jpg");
NormalTexture.wrapS = THREE.RepeatWrapping;
NormalTexture.wrapT = THREE.RepeatWrapping;
NormalTexture.repeat.set(2, 2);
const geometry = new THREE.SphereGeometry(50);
const material = new THREE.MeshStandardMaterial({
    map: texture,
    normalMap: NormalTexture,
});
const moon = new THREE.Mesh(geometry, material);
scene.add(moon);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 80);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0x9999ff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(1000));

    star.position.set(x, y, z);
    scene.add(star);
}

var manta;
var station;
var orca;
var mixer_manta;
var mixer_station;
var mixer_orca;
var theta = 0;
var phi = 0;
var x_manta;
var y_manta;
var z_manta;
var x_station;
var y_station;
var z_station;
var x_orca;
var y_orca;
var z_orca;


// All 3D models are from SketchFab
// https://sketchfab.com/3d-models/manta-cdc4752c492c43559caa4cfb528000d8
// https://sketchfab.com/3d-models/space-station-v-2001-a-space-odyssey-cc2f60147e3b407d833685cb2349708a
// https://sketchfab.com/3d-models/female-orca-e5eb46758cd242efabe49954cdd16980
const loader = new GLTFLoader();
loader.load(
    "./manta.glb",
    function (gltf) {
        addManta(gltf);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

const loader_station = new GLTFLoader();
loader_station.load(
    "./space_station.glb",
    function (gltf) {
        addStation(gltf);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

const loader_orca = new GLTFLoader();
loader_orca.load(
    "./orca.glb",
    function (gltf) {
        addOrca(gltf);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

function addManta(gltf) {
    manta = gltf;
    mixer_manta = new THREE.AnimationMixer(manta.scene);
    const action = mixer_manta.clipAction(manta.animations[0]);
    action.play();
    scene.add(manta.scene);
}

function addStation(gltf) {
    station = gltf;
    mixer_station = new THREE.AnimationMixer(station.scene);
    const action = mixer_station.clipAction(station.animations[0]);
    action.play();
    scene.add(station.scene);
}

function addOrca(gltf) {
    orca = gltf;
    mixer_orca = new THREE.AnimationMixer(orca.scene);
    const action = mixer_orca.clipAction(orca.animations[0]);
    action.play();

    scene.add(orca.scene);
}

Array(500).fill().forEach(addStar);

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    theta += 0.006;
    phi += 0.001;
    
    if (manta) {
        x_manta = 70 * Math.cos(theta)
        y_manta = 5 * Math.sin(theta)
        z_manta = 70 * Math.sin(theta)
        manta.scene.position.set(x_manta, y_manta, z_manta);
        manta.scene.rotation.set(0, -theta, 2*theta);
        manta.scene.scale.set(2, 2, 2)

    }
    if (station) {
        x_station = 80 * Math.sin(phi) * Math.cos(phi)
        y_station = 80 * Math.sin(phi) * Math.sin(phi)
        z_station = 80 * Math.cos(phi)
        station.scene.position.set(x_station, y_station, z_station);
        station.scene.rotation.set(2 * phi, 2 * phi, 2 * phi);
        station.scene.scale.set(0.001, 0.001, 0.001)
    }
    if (orca) {
        x_orca = 50 * Math.cos(theta/ 2)
        y_orca = 30 + 0.5 * Math.sin(6 * theta)
        z_orca = 50 * Math.sin(theta/ 2)
        orca.scene.position.set(x_orca, y_orca, z_orca);
        orca.scene.rotation.set(0, -theta/2, 0);
        orca.scene.scale.set(0.7, 0.7, 0.7)
    }
    scene.add(manta.scene);
    scene.add(station.scene);
    scene.add(orca.scene);

    moon.rotation.x += 0.0005;
    moon.rotation.y += 0.0001;
    moon.rotation.z += 0.0005;

    controls.update();

    renderer.render(scene, camera);
    mixer_manta.update(delta);
    mixer_station.update(delta);
    mixer_orca.update(delta);
}

animate();
