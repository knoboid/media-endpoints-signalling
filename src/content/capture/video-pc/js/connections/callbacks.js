export function onSetLocalSuccess(name) {
  console.log(`${name} setLocalDescription complete`);
}

export function onSetRemoteSuccess(name) {
  console.log(`${name} setRemoteDescription complete`);
}

export function onAddIceCandidateSuccess(name) {
  console.log(`${name} addIceCandidate success`);
}

export function onAddIceCandidateError(name, error) {
  console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
}

export function onSetSessionDescriptionError(error) {
  console.log(`Failed to set session description: ${error.toString()}`);
}

export function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

export function onIceStateChange(pc, name, event) {
  if (pc) {
    console.log(`${name} ICE state: ${pc.iceConnectionState}`);
    console.log("ICE state change event: ", event);
  }
}
