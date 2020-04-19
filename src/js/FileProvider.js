import Observer from "./Observer";

const reader = new FileReader();
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector("#file");
  fileInput.addEventListener("change", (e) =>
    FileProvider.instance.eventHandler(e)
  );
});

export default class FileProvider {
  constructor() {
    this.file = null;
    this.arrayBuffer = null;

    this.observer = new Observer();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new FileProvider();
    }

    return this._instance;
  }

  eventHandler(event) {
    reader.onload = FileProvider.instance.readerHandler.bind(this);

    this.file = event.target.files[0];
    reader.readAsArrayBuffer(this.file);

    const name = this.file.name.split(".")[0];
    document.getElementById("name").innerHTML = name;
  }

  readerHandler(e) {
    this.arrayBuffer = e.target.result;

    this.observer.notify(this.arrayBuffer);
  }

  subscribe(f) {
    this.observer.subscribe(f);
  }
}
