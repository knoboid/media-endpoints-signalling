const getEnv = require("../util").getEnv;

let authenticated = false;

function wsAdmin({ client, type, payload, users, connections }) {
  function sendUserData() {
    client.send(
      JSON.stringify({ type: "updateUsers", payload: users.getUsersTable() })
    );
  }
  function onAuth() {
    users.addEventListener("updateUsers", (e) => {
      sendUserData();
    });
  }

  switch (type) {
    case "secret":
      authenticated = payload === getEnv("WS_ADMIN_SECRET");
      client.send(
        JSON.stringify({ type: "authenticated", payload: authenticated })
      );
      if (authenticated) {
        onAuth();
      }
      break;

    default:
      if (authenticated) {
        switch (type) {
          case "sendData":
            sendUserData();
            break;

          case "newCall":
            const transmittingUser = users.getUser(payload.transmittingUserId);
            if (transmittingUser.transmitters.length === 0) {
              console.log("Calling user has no tranmitters");
              return;
            }
            for (const transmitterId of transmittingUser.transmitters) {
              const transmitterStatus =
                connections.getClientStatus(transmitterId);
              if (transmitterStatus === "available") {
                console.log(`Can call ${transmitterId}`);
                const socket = transmittingUser.getSocket();
                socket.send(
                  JSON.stringify({
                    type: "callUser",
                    payload: {
                      transmitterId,
                      receivingUserId: payload.receivingUserId,
                    },
                  })
                );
              }
            }
            console.log();
            break;

          default:
            console.log(`ws admin - unhandled type: ${type}`);

            break;
        }
      }

      break;
  }
}

module.exports = wsAdmin;
