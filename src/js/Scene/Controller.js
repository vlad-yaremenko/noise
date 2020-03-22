document.addEventListener("mousemove", onDocumentMouseMove);

function onDocumentMouseMove(event) {
  Controller.instance.set(event.clientX, event.clientY);
}

export default class Controller {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  static diapason = {
    x: window.innerWidth / 5,
    y: window.innerHeight / 5
  };

  static get instance() {
    if (!this._instance) {
      this._instance = new Controller();
    }

    return this._instance;
  }

  set(x, y) {
    this.x = x - Controller.diapason.x;
    this.y = y - Controller.diapason.y;
  }
}
