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

export function createTransmitterConnection(
  servers,
  name,
  stream,
  signallingChannel,
  offerOptions
) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, name, e);
  cc.onicecandidate = (e) => onIceCandidate(e);

  stream.getTracks().forEach((track) => cc.addTrack(track, stream));

  log("transmitter createOffer start");
  cc.createOffer(offerOptions)
    .then(onCreateOfferSuccess)
    .catch(onCreateSessionDescriptionError);

  function onCreateOfferSuccess(desc) {
    log(`Offer from transmitter ${desc.sdp}`);
    log("transmitter setLocalDescription start");
    cc.setLocalDescription(desc)
      .then(onSetLocalSuccess)
      .catch(onSetSessionDescriptionError);
    log("signal onTransmitterDescription");
    signal("onTransmitterDescription", desc);
  }

  function onIceCandidate(event) {
    signal("onIceCandidate", event.candidate);
  }

  function signal(type, payload) {
    signallingChannel.transmitter(JSON.stringify({ type, payload }));
  }

  signallingChannel.addEventListener("fromReciever", (event) => {
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
      case "onRecievererDescription":
        const desc = payload;
        cc.setRemoteDescription(desc)
          .then(onSetRemoteSuccess)
          .catch(onSetSessionDescriptionError);
        break;

      default:
        break;
    }
  });

  return cc;
}
