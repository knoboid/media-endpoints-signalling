import PayloadEvent from "../payload-event.js";

class SignallingChannel extends EventTarget {
  constructor() {
    super();
  }

  // Called by the caller
  callerIceCandidate(candidate) {
    this.dispatchEvent(new PayloadEvent("fromCallerIceCandidate", candidate));
  }

  // Called by the response
  responderIceCandidate(candidate) {
    this.dispatchEvent(
      new PayloadEvent("fromResponderIceCandidate", candidate)
    );
  }
}

export default SignallingChannel;
