class ReceiverEndpoint extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<div>receiver</div>";
    this.videoElement = document.createElement("video");
    this.videoElement.setAttribute("style", "width: 200px");
    this.videoElement.setAttribute("playsinline", true);
    this.videoElement.setAttribute("autoplay", true);
    this.videoElement.setAttribute("controls", true);
    this.videoElement.volume = 0;
    this.appendChild(this.videoElement);
  }
}

export default ReceiverEndpoint;
