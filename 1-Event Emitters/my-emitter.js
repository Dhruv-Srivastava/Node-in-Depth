export default class MyEmitter {
  #myEmitterObj;

  constructor() {
    this.#myEmitterObj = {};
  }

  on(eventName, callback) {
    if (this.#myEmitterObj.hasOwnProperty(eventName))
      this.#myEmitterObj[eventName].push(callback);
    else {
      this.#myEmitterObj[eventName] = [callback];
    }
  }
  
  emit(eventName) {
    if (!this.#myEmitterObj.hasOwnProperty(eventName)) return;

    const callbacks = this.#myEmitterObj[eventName];
    for(const callback of callbacks)
        callback()
  }
}
