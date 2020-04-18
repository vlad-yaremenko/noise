import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

import Controller from "./Controller";

const perspective = 800;

export default class Scene {
  constructor(container) {
    this.updates = [];
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("black");

    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      this.scene.add(light);
    }
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, 0, 0);
      this.scene.add(light);
      this.scene.add(light.target);
    }

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    this.actors = new THREE.Object3D();
    this.scene.add(this.actors);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.appendChild(this.renderer.domElement);

    this.initLights();
    this.initCamera();

    {
      const controls = new OrbitControls(this.camera, container);
      controls.target.set(0, 5, 0);
      controls.update();
    }
  }

  start() {
    const loader = new OBJLoader2();

    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load("./Super_meatboy_free.mtl", (mtlParseResult) => {
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(
          mtlParseResult
        );
        loader.addMaterials(materials);
        loader.load("./Super_meatboy_free.obj", (root) => {
          root.scale.x = 100;
          root.scale.y = 100;
          root.scale.z = 100;

          const uniforms = {};
          uniforms.colorA = { type: "vec3", value: new THREE.Color(0x74ebd5) };
          uniforms.colorB = { type: "vec3", value: new THREE.Color(0xacb6e5) };

          const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader(),
            vertexShader: vertexShader(),
          });

          console.log(root);

          root.children[0].material = material;

          this.actors.add(root);
        });
      });
    }

    function vertexShader() {
      return `
        varying vec3 vUv;
        varying vec4 modelViewPosition;
        varying vec3 vecNormal;

        void main() {
          vUv = position;
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz; //????????
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `;
    }
    function fragmentShader() {
      return `
          uniform vec3 colorA;
          uniform vec3 colorB;
          varying vec3 vUv;

          void main() {
            gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
          }
      `;
    }

    this.update();
  }

  clear() {
    while (this.actors.children.length > 0) {
      this.actors.remove(this.actors.children[0]);
    }
  }

  initLights() {
    const light = new THREE.DirectionalLight(0x888888, 1, 100);
    light.position.set(0, 0, 1);
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  }

  initCamera() {
    const fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, perspective);
  }

  addMesh(mesh) {
    this.actors.add(mesh);
  }

  addUpdate(func) {
    this.updates.push(func);
  }

  update(time) {
    if (this.renderer === undefined) return;
    requestAnimationFrame(this.update.bind(this));

    this.camera.position.x +=
      (Controller.instance.x - this.camera.position.x) * 0.05;
    this.camera.position.y +=
      (-Controller.instance.y - this.camera.position.y) * 0.05;

    this.updates.forEach((i) => i && i());

    TWEEN.update(time);

    this.renderer.render(this.scene, this.camera);
  }
}
