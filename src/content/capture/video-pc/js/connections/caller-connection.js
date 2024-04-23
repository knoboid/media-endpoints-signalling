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
    signallingChannel.callerIceCandidate(JSON.stringify(event.candidate));
  }

  signallingChannel.addEventListener("fromResponderIceCandidate", (event) => {
    const candidate = JSON.parse(event.payload);
    cc.addIceCandidate(candidate).then(
      () => onAddIceCandidateSuccess(cc),
      (err) => onAddIceCandidateError(cc, err)
    );
    console.log(`${name} ICE candidate: 
    ${candidate ? candidate.candidate : "(null)"}`);
  });

  function onAddIceCandidateSuccess(pc) {
    console.log(`${name} addIceCandidate success`);
  }

  function onAddIceCandidateError(pc, error) {
    console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
  }

  return cc;
}
