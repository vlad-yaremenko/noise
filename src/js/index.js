import "babel-polyfill";
import Scene from "./Scene/index.js";
import WaveObject from "./Objects/WaveObject";

import AudioDataProvider from "./AudioDataProvider";
import FileProvider from "./FileProvider";

document.addEventListener("DOMContentLoaded", () => {
  const scene = new Scene(document.getElementById("container"));

  const audioData = new AudioDataProvider(FileProvider.instance);

  scene.start();

  audioData.subscribe(() => {
    scene.clear();
    audioData.reset();

    const waveObj = new WaveObject(
      audioData.getByteFrequency(),
      audioData.getByteTimeDomain()
    );

    scene.addMesh(waveObj.mesh);

    scene.addUpdate(() => {
      // waveObj.setBitFrequency(audioData.getByteFrequency());
      // waveObj.setColorFrequency(audioData.getByteTimeDomain());
      // waveObj.update();
    });

    audioData.start();
    scene.start();
  });
});
