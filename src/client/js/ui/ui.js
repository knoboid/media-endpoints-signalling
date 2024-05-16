const receiversContainder = document.querySelector("#receivers-container");
// receiver
const rightVideo = document.getElementById("rightVideo");
const receiverIDElement = document.querySelector("#receiver-id");
const receiverHangupButton = document.querySelector("#receiver-hangup");
// right video
export function setRecieverID(receiverID) {
  receiverIDElement.innerHTML = receiverID;
}

export function addRecieverElement() {
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

export class RecieverUI {
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

export class RecieverUIEvents extends EventTarget {
  constructor() {
    super();
    this.receiverHangupButton = receiverHangupButton;

    this.receiverHangupButton.onclick = () => {
      this.dispatchEvent(new Event("receiver-hangup"));
    };
  }
}

export const receiverUIEvents = new RecieverUIEvents(receiverHangupButton);
