import { startServer } from "./api/server.js";
import { credentials } from "./v2/server/security/https-credentials.js";

startServer(undefined, credentials);
