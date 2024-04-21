const https = require("https");
const credentials = require("./https-credentials").credentials;

const express = require("express");

const app = express();

const appPath = "../src/content/datachannel/basic";

app.use("/", express.static(appPath));

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(5500);
