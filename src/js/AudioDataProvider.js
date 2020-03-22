import Observer from "./Observer";

export default class AudioDataProvider {
  constructor(provider) {
    if (!provider) throw TypeError("provider is required");

    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.observer = new Observer();

    this.provider = provider;
    this.provider.subscribe(arrayBuffer => {
      this.generate(arrayBuffer);
    });

    this.audioSource = this.context.createBufferSource();

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 32;

    this.bufferLength = this.analyser.frequencyBinCount;

    this.frequencyData = new Uint8Array(this.bufferLength);
    this.timeDomainData = new Uint8Array(this.bufferLength);
  }

  async generate(arrayBuffer) {
    this.observer.notify(arrayBuffer);

    const buffer = await this.context.decodeAudioData(arrayBuffer);
    this.audioSource.buffer = buffer;
    this.audioSource.connect(this.analyser);
    this.audioSource.connect(this.context.destination);
  }

  getByteFrequency() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getByteTimeDomain() {
    this.analyser.getByteTimeDomainData(this.timeDomainData);
    return this.timeDomainData;
  }

  start() {
    this.audioSource.start();
  }

  subscribe(f) {
    this.observer.subscribe(f);
  }
}

//   init(arrayBuffer) {
//     return new Promise(async (resolve, reject) => {
//       this.audio.buffer = buffer;

//       this.audio.connect(this.context.destination);

//       this.rawData = buffer.getChannelData(0);

//       resolve(this.getData());
//     });

//   play() {
//     this.audio.start(0);
//   }

//   getData(minValue = 0) {
//     return this.normalizeData(this.filterData(this.rawData, minValue));
//   }

//   get currentTime() {
//     return this.context.currentTime;
//   }

//   get sampleRate() {
//     return this.context.sampleRate;
//   }

//   filterData(rawData, minValue = 0) {
//     const filteredData = [];
//     console.log(rawData);
//     for (let i = 0; i < rawData.length; i++) {
//       if (rawData[i] < minValue) {
//         filteredData.push(0);
//       } else {
//         filteredData.push(rawData[i]);
//       }
//     }

//     return filteredData;
//   }

//   normalizeData(filteredData) {
//     const multiplier = Math.pow(0.02, -1);
//     return filteredData.map(n => n * multiplier);
//   }
// }
