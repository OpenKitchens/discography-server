/* This is default discography plugin. */
/* All created by moyasi and garlic power 💪🧄 */

const api = require("./api.js");
const net = require("./net.js");

exports.api = (req, res, assets) => {
  api(req, res, assets.databaseAPI, assets.netAPI);
};

exports.net = (rinfo, message, assets) => {
  net(rinfo, message, assets.databaseAPI, assets.netAPI);
};

exports.assets = (axios, socket) => {
  databaseAPI.axios = axios
  netAPI.socket = socket

  return { databaseAPI: databaseAPI, netAPI: netAPI }
}

/* アセット */

//databaseAPI
const databaseAPI = {};
databaseAPI.get = (link, func) => {
  databaseAPI.axios
    .post(`http://localhost:3000/database/get/discography.${link}`)
    .then((data) => {
      func(data.data);
    })
    .catch((error) => {
      console.error("Error:", error.data);
    });
};

//Net通信
const netAPI = {};
netAPI.send = (ip, port, pot) => {
  netAPI.socket.send(JSON.stringify(pot), port, ip, (error) => {
    if (error) {
      console.error("送信エラー:", error);
    } else {
      console.log(`送信成功`);
    }
  });
};
netAPI.on = (type, func) => {
  netAPI.socket.on("message", (msg, rinfo) => {
    const message = JSON.parse(msg);
    console.log(message);
    if (message.request[type]) {
      func(message);
    }
  });
};