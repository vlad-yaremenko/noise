import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import Controller from "./Controller";
import { AmbientLight } from "three";

const perspective = 800;

export default class Scene {
  constructor(container) {
    this.updates = [];
    this.container = container;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.appendChild(this.renderer.domElement);

    this.initLights();
    this.initCamera();
  }

  start() {
    this.update();
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
    this.scene.add(mesh);
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

    this.updates.forEach(i => i && i());

    TWEEN.update(time);

    this.renderer.render(this.scene, this.camera);
  }
}
