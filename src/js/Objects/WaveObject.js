import * as THREE from "three";
import { normalize } from "../helper";

const MAX_VALUE = 255;

export default class WaveObject {
  constructor(bitFrequency = [], colorFrequency = []) {
    this.data = bitFrequency;
    this.colors = colorFrequency;

    this.mesh = new THREE.Group();
    this.mesh.position.y = 100;

    this.minSize = 5;
    this.maxSize = 100;

    const meshWidth = 40;
    const meshesAmount = this.data.length * 2;
    const amountHalf = meshesAmount / 2;

    const geometry = new THREE.BoxGeometry(2, 2, 2);

    for (let i = 0; i < meshesAmount; i++) {
      const color =
        i == amountHalf || i == amountHalf - 1 ? 0x0078ff : 0x202020;
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color })
      );
      mesh.position.x = i * meshWidth - (meshesAmount * meshWidth) / 2;
      mesh.scale.x = meshWidth / 2;
      mesh.scale.y = mesh.scale.z = 100;
      this.mesh.add(mesh);
    }
  }

  setBitFrequency(data) {
    this.data = data;
  }

  setColorFrequency(data) {
    this.colors = data;
  }

  update() {
    this.data.forEach((value, i) => {
      const middle = this.mesh.children.length / 2;
      const firstMeshIndex = middle - (i + 1);
      const lastMeshIndex = middle + i;

      const firstMesh = this.mesh.children[firstMeshIndex];
      const lastMesh = this.mesh.children[lastMeshIndex];

      if (i === 0) {
        firstMesh.material.color = this.getColor();
        lastMesh.material.color = this.getColor();
      }

      firstMesh.scale.y = firstMesh.scale.z = this.normalizeValue(value);

      lastMesh.scale.y = lastMesh.scale.z = this.normalizeValue(value);
    });
  }

  normalizeValue(value) {
    return normalize(value, MAX_VALUE, this.maxSize, this.minSize);
  }

  getColor() {
    const length = this.colors.length - 1;
    const middle = Math.round(length / 2);
    const first = middle - Math.round(middle / 2);
    const last = middle + Math.round(middle / 2);

    const normalFirst = normalize(this.colors[middle], MAX_VALUE, 49, 22);
    const normalMid = normalize(this.colors[first], MAX_VALUE, 211, 28);
    const normalLast = normalize(this.colors[last], MAX_VALUE, 230, 136);

    return new THREE.Color(
      normalFirst / 255,
      normalMid / 255,
      normalLast / 255
    );
  }
}
