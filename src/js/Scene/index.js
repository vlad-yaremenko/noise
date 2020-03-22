import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import Controller from "./Controller";

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
    const ambientlight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientlight);
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

    // Camera pos update
    this.camera.position.x +=
      (Controller.instance.x - this.camera.position.x) * 0.05;
    this.camera.position.y +=
      (-Controller.instance.y - this.camera.position.y) * 0.05;

    this.updates.forEach(i => i && i());

    TWEEN.update(time);

    this.renderer.render(this.scene, this.camera);
  }
}
