import "babel-polyfill";
import * as THREE from "three";

import Scene from "./Scene.js";

window.mouseX = 0;
window.mouseY = 0;

const reader = new FileReader();

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("DOMContentLoaded", () => {
  window.scene = new Scene(document.getElementById("container"));

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  window.audioWave = new AudioWave(audioContext);

  const fileInput = document.querySelector("#file");
  fileInput.addEventListener("change", function(file) {
    reader.onload = function() {
      const arrayBuffer = this.result;

      window.audioWave.init(arrayBuffer).then(res => {
        console.log(res.lenght);

        const figure = new Figure();

        window.scene.addMesh(figure.mesh);

        const data = window.audioWave.getData();
        window.scene.addUpdate(() => {
          figure.update(audioWave.currentTime, data);
        });

        window.scene.update();

        window.audioWave.play();
      });
    };
    reader.readAsArrayBuffer(this.files[0]);
  });
});

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
function onDocumentMouseMove(event) {
  window.mouseX = event.clientX - windowHalfX;
  window.mouseY = event.clientY - windowHalfY;
}

class AudioWave {
  constructor(context) {
    this.context = context;

    this.audio = context.createBufferSource();
  }

  init(arrayBuffer) {
    return new Promise(async (resolve, reject) => {
      const buffer = await this.context.decodeAudioData(arrayBuffer);
      this.audio.buffer = buffer;

      this.audio.connect(this.context.destination);

      this.rawData = buffer.getChannelData(0);

      resolve(this.getData());
    });
  }

  play() {
    this.audio.start(0);
  }

  getData() {
    return this.normalizeData(this.filterData(this.rawData));
  }

  get currentTime() {
    return this.context.currentTime;
  }

  filterData(rawData) {
    // const samples = 5000; // Number of samples we want to have in our final data set
    // const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    // const startPoint = parseInt(this.currentTime);
    // if (startPoint + samples < rawData.length) {
    for (let i = 0; i < rawData.length; i++) {
      // let blockStart = blockSize * i; // the location of the first sample in the block
      // let sum = 0;
      // for (let j = 0; j < blockSize; j++) {
      // sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      // }
      // filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
      filteredData.push(rawData[i]);
    }
    // }

    return filteredData;
  }

  normalizeData(filteredData) {
    return filteredData.map(n => n * 100);
  }
}

class Figure {
  constructor() {
    this.mesh = new THREE.Group();

    var meshWidth = 20;
    var amount = 5000;
    this.amountHalf = amount / 2;

    const geometry = new THREE.BoxGeometry(2, 2, 2);

    for (let i = 0; i < amount; i++) {
      const color = i == this.amountHalf ? 0x0078ff : 0x202020;
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color })
      );

      mesh.position.x = i * meshWidth - (amount * meshWidth) / 2;
      mesh.scale.x = meshWidth / 2;
      mesh.scale.y = mesh.scale.z = 100;

      this.mesh.add(mesh);
    }
  }

  update(audioTime, data) {
    const amplitude = Math.floor((44100 * audioTime) / 1);

    this.mesh.children.forEach((mesh, i) => {
      // mesh.scale.y = mesh.scale.z = data[(amplitude + i) - this.amountHalf] * .1
      mesh.scale.y = mesh.scale.z = data[amplitude];
    });
  }
}
