import registerWebComponents from "./ui/register-web-components.js";
import { adminSetup } from "./admin.js";

const switchboardComponent = document.querySelector("#switchboard");

registerWebComponents();

adminSetup(switchboardComponent);
