export function createCallerConnection(servers, name, signallingChannel) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, e);
  cc.onicecandidate = (e) => onIceCandidate(e);

  function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${name} ICE state: ${pc.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    }
  }

  function onIceCandidate(event) {
    signallingChannel.callerIceCandidate(event.candidate);
  }

  signallingChannel.addEventListener("fromResponderIceCandidate", (event) => {
    cc.addIceCandidate(event.payload).then(
      () => onAddIceCandidateSuccess(cc),
      (err) => onAddIceCandidateError(cc, err)
    );
    console.log(`${name} ICE candidate: 
    ${event.payload ? event.payload.candidate : "(null)"}`);
  });

  function onAddIceCandidateSuccess(pc) {
    console.log(`${name} addIceCandidate success`);
  }

  function onAddIceCandidateError(pc, error) {
    console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
  }

  return cc;
}
