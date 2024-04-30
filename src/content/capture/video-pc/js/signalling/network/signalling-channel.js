import PayloadEvent from "../payload-event.js";

class SignallingChannel extends EventTarget {
  constructor() {
    super();
  }

  caller(data) {
    this.dispatchEvent(new PayloadEvent("fromCaller", data));
  }

  reciever(data) {
    this.dispatchEvent(new PayloadEvent("fromReciever", data));
  }
}

export default SignallingChannel;
