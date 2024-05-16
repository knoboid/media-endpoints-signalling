const receiversContainder = document.querySelector("#receivers-container");
// receiver
const rightVideo = document.getElementById("rightVideo");
const receiverIDElement = document.querySelector("#receiver-id");
const receiverHangupButton = document.querySelector("#receiver-hangup");
// right video
export function setReceiverID(receiverID) {
  receiverIDElement.innerHTML = receiverID;
}

export function addReceiverElement() {
  const video = document.createElement("video");
  video.setAttribute("style", "width: 200px");
  video.setAttribute("playsinline", true);
  video.setAttribute("autoplay", true);
  video.setAttribute("controls", true);
  video.volume = 0;
  receiversContainder.appendChild(video);
  return video;
}

rightVideo.onloadedmetadata = () => {
  console.log(
    `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
  );
};

export class ReceiverUI {
  constructor() {
    this.videoElement = document.createElement("video");
    video.setAttribute("style", "width: 200px");
    video.setAttribute("playsinline", true);
    video.setAttribute("autoplay", true);
    video.setAttribute("controls", true);
    video.volume = 0;
    receiversContainder.appendChild(video);
  }

  set id(id) {
    this._id = id;
  }
}

export class ReceiverUIEvents extends EventTarget {
  constructor() {
    super();
    this.receiverHangupButton = receiverHangupButton;

    this.receiverHangupButton.onclick = () => {
      this.dispatchEvent(new Event("receiver-hangup"));
    };
  }
}

export const receiverUIEvents = new ReceiverUIEvents(receiverHangupButton);
