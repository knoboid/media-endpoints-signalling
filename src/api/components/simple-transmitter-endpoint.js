import TransmitterEndpoint from "./transmitter-endpoint.js";
import Transmitter from "../../v2/client/transmitter.js";
import DataTable from "./data-table.js";

class SimpleTransmitterEndpoint extends TransmitterEndpoint {
  constructor() {
    super();
    this.input = document.createElement("input");
    this.input.placeholder = "receiver id";
    this.input.type = "text";
    this.callButton = document.createElement("button");
    this.callButton.innerHTML = "Call";
    this.hangupButton = document.createElement("button");
    this.hangupButton.innerHTML = "Hangup";
    this.getDataButton = document.createElement("button");
    this.getDataButton.innerHTML = "GET";
    this.appendChild(document.createElement("br"));
    this.appendChild(this.input);
    this.appendChild(this.callButton);
    this.appendChild(this.hangupButton);
    this.appendChild(this.getDataButton);

    this.transmitter = new Transmitter(null, null, null, (id) =>
      this.onTransmitterReady(id)
    );

    this.callButton.onclick = () => {
      const receiverId = this.input.value;
      if (!isNaN(receiverId)) {
        this.call(receiverId);
      }
    };

    this.hangupButton.onclick = () => {
      this.transmitter.hangup();
    };

    this.getDataButton.onclick = () => {
      this.transmitter.send("getData");
    };

    this.dataTable = document.createElement("div");
    this.appendChild(this.dataTable);

    this.transmitter.addEventListener("endpointData", (e) => {
      const endpointData = e.data.payload;
      this.dataTable.innerHTML = "";
      this.dataTable.appendChild(new DataTable(endpointData));
    });
  }

  onTransmitterReady(transmitterId) {
    this.setId(transmitterId);
  }

  call(receiverId) {
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.transmitter.attachStream(stream);
      this.transmitter.initiateCall(receiverId);
    });
  }
}

export default SimpleTransmitterEndpoint;
