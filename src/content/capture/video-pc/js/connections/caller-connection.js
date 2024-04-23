export function createCallerConnection(
  servers,
  name,
  stream,
  signallingChannel
) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, e);
  cc.onicecandidate = (e) => onIceCandidate(e);

  function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${name} ICE state: ${pc.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    }
  }

  stream.getTracks().forEach((track) => cc.addTrack(track, stream));

  function onIceCandidate(event) {
    signallingChannel.caller(
      JSON.stringify({ type: "onIceCandidate", payload: event.candidate })
    );
  }

  signallingChannel.addEventListener("fromResponder", (event) => {
    const { type, payload } = JSON.parse(event.data);
    switch (type) {
      case "onIceCandidate":
        const candidate = payload;
        cc.addIceCandidate(candidate).then(
          () => onAddIceCandidateSuccess(cc),
          (err) => onAddIceCandidateError(cc, err)
        );
        console.log(`${name} ICE candidate: 
        ${candidate ? candidate.candidate : "(null)"}`);
        break;

      default:
        break;
    }
  });

  function onAddIceCandidateSuccess(pc) {
    console.log(`${name} addIceCandidate success`);
  }

  function onAddIceCandidateError(pc, error) {
    console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
  }

  return cc;
}
