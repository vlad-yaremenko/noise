export default class Observer {
  constructor() {
    this.subscribers = [];
  }

  subscribe(f) {
    if (f instanceof Function) {
      this.subscribers.push(f);
    } else {
      throw new TypeError("callback is not instance of the Function");
    }
  }

  notify(...data) {
    this.subscribers.forEach(f => {
      f(...data);
    });
  }
}
