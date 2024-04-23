import PayloadEvent from "../payload-event.js";

class CallerSignaller extends EventTarget {
  constructor(signallingChannel) {
    super();
    this.signallingChannel = signallingChannel;
    this.signallingChannel.addEventListener("fromResponder", (event) =>
      this.dispatchEvent(new PayloadEvent("fromResponder", event.data))
    );
  }

  caller(data) {
    this.signallingChannel.caller(data);
  }
}

export default CallerSignaller;
