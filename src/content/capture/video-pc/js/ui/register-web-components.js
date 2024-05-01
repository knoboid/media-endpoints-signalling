import RecieversList from "./components/recievers-list.js";
import ReciverRow from "./components/reciever-row.js";

export default function registerWebComponents() {
  customElements.define("recievers-list", RecieversList);
  customElements.define("reciever-row", ReciverRow);
}
