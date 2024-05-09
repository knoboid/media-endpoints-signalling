import PayloadEvent from "../../payload-event.js";
let id = 1;

class NameEntry extends HTMLElement {
  constructor() {
    super();
    this.id = id;
    this.innerHTML = `<input id="name-input-${this.id}" type="text" placeholder="name..." /><button
    id="name-input-button-${this.id}"
    name-button
  >
    submit
  </button>`;
    this.input = this.querySelector(`#name-input-${this.id}`);
    this.button = this.querySelector(`#name-input-button-${this.id}`);
    console.log(this.input);
    console.log(this.button);
    this.button.onclick = (e) => this.handleEnterName(e);
    id++;
  }

  handleEnterName(e) {
    console.log("handleEnterName");
    const enteredName = this.input.value;
    console.log(enteredName);
    if (enteredName !== "") {
      this.dispatchEvent(new PayloadEvent("usernameEntered", enteredName));
    }
  }
}

export default NameEntry;
