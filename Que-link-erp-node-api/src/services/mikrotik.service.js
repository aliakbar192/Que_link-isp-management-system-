const RosApi = require("node-routeros").RouterOSAPI;

const addMikrotikApiUser = async (server, client, type) => {
  const conn = new RosApi({
    host: server.ip,
    user: server.name,
    password: server.password,
    keepalive: true,
    // host: "103.167.254.222",
    // user: "admin",
    // password: "Azeemboi@outlook",
    // keepalive: true,
  });

  let connection;

  try {
    connection = await conn.connect();
    console.log("profile is " + client.profile);
    conn
      .write("/ppp/secret/add", [
        "=name=" + client.name,
        "=password=" + client.password,
        "=service=pppoe",
        "=profile=" + client.profile,
      ])
      .then((data) => {
        console.log("Add Result: ", data);
        return conn.write("/ppp/secret/print", ["?.id=" + data[0].ret]);
      })
      .then((data) => {
        console.log("Remove Result: ", data);
        return conn.write("/ppp/secret/print");
      });
    // const pppUser = await conn.write('/ppp/secret/add',
    //     [
    //         '=name='+client.name,
    //         '=password='+client.password,
    //         '=service=pppoe',
    //         '=profile='+client.profile,
    //     ]);
    // if(pppUser.length > 0) {
    //     return  "User added to NAS"
    // }
    // connection.close();
  } catch (e) {
    if (connection) {
      connection.close();
    }
    if (e.toString() === "RosException") {
      return "NAS appears to be offline, User will be added when NAS will be online again";
    }
    if (
      e.toString() ===
      "Error: failure: secret with the same name already exists"
    ) {
      return "User already has a subscription";
    }
    return "Error: " + e;
  }
};

const removeMikrotikApiUser = async (server, client, type) => {
  const conn = new RosApi({
    host: server.ip,
    user: server.name,
    password: server.password,
    keepalive: true,
  });

  let connection;

  try {
    connection = await conn.connect();
    const pppUsers = await conn.write("/ppp/secret/print");
    let pppUser = pppUsers.filter((u) => u.name === client.name);
    if (pppUser.length > 0) {
      let deletedUser = await conn.write("/ppp/secret/remove", [
        "=.id=" + pppUser[0][".id"],
      ]);
      const pppActiveUsers = await conn.write("/ppp/active/print");
      let pppActiveUser = pppActiveUsers.filter((u) => u.name === client.name);
      if (pppActiveUser.length > 0) {
        let deleteActiveUser = await conn.write("/ppp/active/remove", [
          "=.id=" + pppUser[0][".id"],
        ]);
      }
      connection.close();
      return "User deleted from NAS";
    }
    connection.close();
    return "User already deleted from NAS";
  } catch (e) {
    if (connection) {
      connection.close();
    }
    if (e.toString() === "RosException") {
      return "NAS appears to be offline, User will be added when NAS will be online again";
    }
    return "err: " + e;
  }
};

module.exports = {
  addMikrotikApiUser,
  removeMikrotikApiUser,
};
