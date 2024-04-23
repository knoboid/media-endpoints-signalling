import PayloadEvent from "../payload-event.js";

class ResponderSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromCaller", (event) =>
      this.dispatchEvent(new PayloadEvent("fromCaller", event.data))
    );
  }

  responder(data) {
    this.signallingChannel.responder(data);
  }
}

export default ResponderSignaller;
