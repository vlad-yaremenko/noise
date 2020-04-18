import Observer from "./Observer";

export default class AudioDataProvider {
  constructor(provider) {
    if (!provider) throw TypeError("provider is required");

    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.observer = new Observer();

    this.provider = provider;
    this.provider.subscribe((arrayBuffer) => {
      this.generate(arrayBuffer);
    });

    this.init();
  }

  init() {
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

  reset() {
    if (this.audioSource.context.state === "running") {
      this.audioSource.stop();
    }

    this.init();
  }

  subscribe(f) {
    this.observer.subscribe(f);
  }
}
