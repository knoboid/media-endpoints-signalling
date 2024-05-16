import Receiver from "../../media-receiver.js";
import Transmitter from "../../media-transmitter.js";

class User {
  constructor(servers, constraints, wsSignaller, uiSignaller) {
    this.servers = servers;
    this.transmitters = {};
    this.constraints = constraints;
    this.wsSignaller = wsSignaller;
    this.uiSignaller = uiSignaller;
    this.registerWSListeners();
    this.registerUIListeners();
    this.transmitterRequests = {};
  }

  defineWSListeners() {
    return {
      getUserID: (e) => {
        this.id = e.data;
        this.uiSignaller.resolve("getUserID", this.id);
      },
      transmitterRegistrationCode: (e) => {
        const { code, requestUUID } = e.data;
        const stream = this.transmitterRequests[requestUUID].stream;
        delete this.transmitterRequests[requestUUID];
        const transmitter = new Transmitter(this.servers, stream, code);
        transmitter.addEventListener("onGotTransmitterID", (e) => {
          const id = e.data;
          this.transmitters[id] = transmitter;
        });
        const videoElement = this.uiSignaller.resolve("addVideo");
        videoElement.srcObject = stream;
      },
      updateUsers: (e) => {
        this.uiSignaller.resolve("updateUsers", e.data);
      },
      requestReciever: (e) => {
        console.log(`request receiver for call with user ${e.data}`);
        const { userId, uuid } = e.data;
        const videoElement = this.uiSignaller.resolve(
          "addRecieverVideo",
          e.data.userId
        );
        if (typeof videoElement !== "undefined") {
          const onready = (receiverId) => {
            this.wsSignaller.send({
              type: "receiverReady",
              payload: { receiverId, userId, uuid },
            });
          };
          const onhangup = () => {
            console.log("hangup signal callback!");
          };
          new Receiver(
            this.servers,
            videoElement,
            e.data.code,
            onready,
            onhangup
          );
        } else {
          console.log("Reciever video not created!");
        }
      },
      receiverRegistrationCode: (e) => {
        console.log("receiverRegistrationCode", e.data);
      },
      userReady: (e) => {
        const { receiverId, transmitterId, uuid } = e.data;
        const transmitter = this.transmitters[transmitterId];
        transmitter.nWTransmitterSignaller.send({
          type: "initiateCall",
          payload: { receiverID: e.data.receiverId, uuid },
        });
      },
      callUser: (e) => {
        const { transmitterId, receivingUserId } = e.data;
        console.log(
          `Request for me to call ${receivingUserId} using transmitter ${transmitterId}`
        );
        console.log({ userId: receivingUserId, transmitterId });
        this.wsSignaller.send({
          type: "initiateCallToUser",
          payload: { userId: receivingUserId, transmitterId },
        });
      },
    };
  }

  defineUIListeners() {
    return {
      addTransmitter: (e) => {
        const stream = e.data;
        const requestUUID = crypto.randomUUID();
        this.transmitterRequests[requestUUID] = { stream };
        this.wsSignaller.send({
          type: "requestTransmitter",
          payload: { requestUUID },
        });
      },
      CALL: (e) => {
        const { userId, transmitterId } = e.data;
        const transmitter = this.transmitters[transmitterId];
        if (transmitter) {
          this.wsSignaller.send({
            type: "initiateCallToUser",
            payload: { userId, transmitterId },
          });
        }
      },
      usernameEntered: (e) => {
        const username = e.data;
        this.wsSignaller.send({
          type: "setUsername",
          payload: username,
        });
      },
    };
  }

  registerWSListeners() {
    const listenerDefs = this.defineWSListeners();
    Object.entries(listenerDefs).forEach(([eventName, callback]) =>
      this.wsSignaller.addEventListener(eventName, callback)
    );
  }

  registerUIListeners() {
    const listenerDefs = this.defineUIListeners();
    Object.entries(listenerDefs).forEach(([eventName, callback]) =>
      this.uiSignaller.addEventListener(eventName, callback)
    );
  }
}

export default User;
