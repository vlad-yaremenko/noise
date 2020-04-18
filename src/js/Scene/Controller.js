document.addEventListener("mousemove", onDocumentMouseMove);
import { normalize } from "../helper";

function onDocumentMouseMove(event) {
  Controller.instance.set(event.clientX, event.clientY);
}

export default class Controller {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  static diapason = {
    x: {
      min: -300,
      max: 300,
    },
    y: {
      min: -300,
      max: 300,
    },
  };

  static get instance() {
    if (!this._instance) {
      this._instance = new Controller();
    }

    return this._instance;
  }

  set(x, y) {
    this.x = normalize(
      x,
      window.innerWidth,
      Controller.diapason.x.max,
      Controller.diapason.x.min
    );
    this.y = normalize(
      y,
      window.innerWidth,
      Controller.diapason.y.max,
      Controller.diapason.y.min
    );
  }
}
