import {
  onSetLocalSuccess,
  onSetRemoteSuccess,
  onAddIceCandidateSuccess,
  onAddIceCandidateError,
  onSetSessionDescriptionError,
  onCreateSessionDescriptionError,
  onIceStateChange,
} from "./callbacks.js";

import { log } from "./util.js";

export function createRecieverConnection(
  servers,
  name,
  signallingChannel,
  videoElement,
  debug = false
) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, name, e);
  cc.onicecandidate = (e) => onIceCandidate(e);
  cc.ontrack = (e) => {
    if (videoElement.srcObject !== e.streams[0]) {
      videoElement.srcObject = e.streams[0];
    }
  };

  function onIceCandidate(event) {
    signallingChannel.receiver(
      JSON.stringify({ type: "onIceCandidate", payload: event.candidate })
    );
  }

  signallingChannel.addEventListener("fromTransmitter", (event) => {
    const { type, payload } = JSON.parse(event.data);
    switch (type) {
      case "onIceCandidate":
        const candidate = payload;
        cc.addIceCandidate(candidate).then(
          () => onAddIceCandidateSuccess(name),
          (err) => onAddIceCandidateError(name, err)
        );
        log(`${name} ICE candidate: 
        ${candidate ? candidate.candidate : "(null)"}`);
        break;

      case "onTransmitterDescription":
        const desc = payload;
        cc.setRemoteDescription(desc)
          .then(onSetRemoteSuccess)
          .catch(onSetSessionDescriptionError);
        cc.createAnswer()
          .then(onCreateAnswerSuccess)
          .catch(onCreateSessionDescriptionError);
        break;

      default:
        break;
    }
  });

  function onCreateAnswerSuccess(desc) {
    log(`Answer from receiver: ${desc.sdp}`);
    log("receiver setLocalDescription start");
    cc.setLocalDescription(desc)
      .then(onSetLocalSuccess)
      .catch(onSetSessionDescriptionError);
    log("signalling onRecievererDescription");
    signal("onRecievererDescription", desc);
  }

  function signal(type, payload) {
    signallingChannel.receiver(JSON.stringify({ type, payload }));
  }

  return cc;
}
