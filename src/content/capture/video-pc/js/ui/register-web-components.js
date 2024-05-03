import RecieversList from "./components/recievers-list.js";
import ReciverRow from "./components/reciever-row.js";
import MediaUser from "./components/media-user.js";

export default function registerWebComponents() {
  customElements.define("recievers-list", RecieversList);
  customElements.define("reciever-row", ReciverRow);
  customElements.define("media-user", MediaUser);
}
