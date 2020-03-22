import "babel-polyfill";
import Scene from "./Scene/index.js";
import WaveObject from "./Objects/WaveObject";

import AudioDataProvider from "./AudioDataProvider";
import FileProvider from "./FileProvider";

document.addEventListener("DOMContentLoaded", () => {
  const scene = new Scene(document.getElementById("container"));

  const audioData = new AudioDataProvider(FileProvider.instance);

  audioData.subscribe(data => {
    console.log("Final", data);

    // console.log(audioData.getByteFrequency());
    // console.log(audioData.getByteTimeDomain());

    const waveObj = new WaveObject(audioData.getByteFrequency());

    scene.addMesh(waveObj.mesh);

    scene.addUpdate(() => {
      waveObj.setByteFrequency(audioData.getByteFrequency());
      waveObj.update();
    });

    audioData.start();
    scene.start();
  });
});
