import * as THREE from "three";

const MAX_VALUE = 255;

export default class WaveObject {
  constructor(byteFrequency) {
    this.data = byteFrequency;

    this.mesh = new THREE.Group();

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
      mesh.position.x = i * meshWidth - ((meshesAmount / 2) * meshWidth) / 2;
      mesh.scale.x = meshWidth / 2;
      mesh.scale.y = mesh.scale.z = 100;
      this.mesh.add(mesh);
    }
  }

  setByteFrequency(data) {
    this.data = data;
  }

  update() {
    this.data.forEach((value, i) => {
      const firstMeshIndex = this.mesh.children.length / 2 - (i + 1);
      const lastMeshIndex = this.mesh.children.length / 2 + i;

      const firstMesh = this.mesh.children[firstMeshIndex];
      const lastMesh = this.mesh.children[lastMeshIndex];

      firstMesh.scale.y = firstMesh.scale.z = this.normalizeValue(value);

      lastMesh.scale.y = lastMesh.scale.z = this.normalizeValue(value);
    });
  }

  normalizeValue(value) {
    return (value / MAX_VALUE) * (this.maxSize - this.minSize) + this.minSize;
  }
}
