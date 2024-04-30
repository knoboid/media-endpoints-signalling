// reciever
const rightVideo = document.getElementById("rightVideo");
const recieverIDElement = document.querySelector("#reciever-id");
const recieverHangupButton = document.querySelector("#reciever-hangup");

export function setRecieverID(recieverID) {
  recieverIDElement.innerHTML = recieverID;
}

rightVideo.onloadedmetadata = () => {
  console.log(
    `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
  );
};

export class RecieverUIEvents extends EventTarget {
  constructor() {
    super();
    this.recieverHangupButton = recieverHangupButton;

    this.recieverHangupButton.onclick = () => {
      this.dispatchEvent(new Event("reciever-hangup"));
    };
  }
}

export const recieverUIEvents = new RecieverUIEvents(recieverHangupButton);
