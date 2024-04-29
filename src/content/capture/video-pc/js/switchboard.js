import { adminSetup } from "./admin.js";

// const wss = "wss://localhost:5501";
// const wss = "wss://192.168.43.35:5502";
const wss = "wss://192.168.0.72:5502";
// const wss = "wss://192.168.0.72:5501";

adminSetup(wss);
