import PayloadEvent from "../../payload-event.js";

class SignallingChannel extends EventTarget {
  constructor() {
    super();
  }

  caller(data) {
    this.dispatchEvent(new PayloadEvent("fromCaller", data));
  }

  responder(data) {
    this.dispatchEvent(new PayloadEvent("fromResponder", data));
  }
}

export default SignallingChannel;
