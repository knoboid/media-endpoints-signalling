class TransmitterEndpoint extends HTMLElement {
  constructor() {
    super();
    this.idElement = document.createElement("div");
    this.setId();
    this.appendChild(this.idElement);
  }

  setId(id) {
    const renderedId = isNaN(id) ? "?" : id;
    this.idElement.innerHTML = `Transmitter ID: ${renderedId}`;
  }
}

export default TransmitterEndpoint;
