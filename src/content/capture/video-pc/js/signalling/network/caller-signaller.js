import PayloadEvent from "../payload-event.js";
import { wss } from "../connections/util.js";

// const socket = new WebSocket("wss://192.168.43.35:5501");
const socket = new WebSocket("wss://localhost:5501");

socket.onopen = function (e) {
  console.log("SOCKET OPENED");
  socket.send("My name is John");
};

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
