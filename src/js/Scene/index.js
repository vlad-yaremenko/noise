import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import Controller from "./Controller";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

const perspective = 800;

export default class Scene {
  constructor(container) {
    this.updates = [];
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x222222, 1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.actors = new THREE.Object3D();
    this.scene.add(this.actors);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.appendChild(this.renderer.domElement);

    this.initLights();
    this.initCamera();
    this.initPostprocessing();
  }

  start() {
    this.update();
  }

  clear() {
    while (this.actors.children.length > 0) {
      this.actors.remove(this.actors.children[0]);
    }
  }

  initLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(0, 0, 1);
    this.scene.add(light);

    this.scene.add(new THREE.AmbientLight(0x222222));
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

  initPostprocessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
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

    this.composer.render();
  }
}
