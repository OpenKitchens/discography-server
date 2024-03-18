const structure = require("./plugins.js")

const pluginsAPI = []
const pluginsNET = []
const pluginsAssets = []

structure.plugins.forEach((data) => {
  const exportedObjects = require(data.path)
  pluginsAPI[data.name] = exportedObjects.api
  pluginsNET[data.name] = exportedObjects.net
  pluginsAssets[data.name] = exportedObjects.assets
})

//net
const dgram = require("dgram")
const express = require("express")
const axios = require("axios")

const socket = dgram.createSocket("udp4")
const app = express()
const netport = 12346
const apiport = 3001

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})

app.get("/api", (req, res) => {
  console.log("get api")
  pluginName = Object.keys(req.query)
  const api = pluginsAPI[pluginName[0]]
  api(req, res, pluginsAssets[pluginName[0]](axios, socket))
})

socket.on("message", (msg, rinfo) => {
  const message = JSON.parse(msg);
  const net = pluginsNET[message.typeNET]
  net(rinfo, message, pluginsAssets[message.typeNET](axios, socket))
})

socket.bind(netport)

socket.on("listening", () => {
  console.log(`Socket is listening on ${socket.address().address}:${socket.address().port}`);
  //sendMessage("send");
});

//database
const fs = require("fs")

let database = {} // データベースとして利用するオブジェクト

// データベースの初期化とデータの読み込み
function initializeDatabase() {
  try {
    const data = fs.readFileSync("database/database.json", "utf8")
    database = JSON.parse(data)
  } catch (err) {
    console.error("Error reading database file:", err)
  }
}

// サーバーの起動時にデータベースを初期化
initializeDatabase()

// POSTリクエストを処理してデータベースに追加し、ディスクに保存
app.post("/database/:action", express.json(), (req, res) => {
  const action = req.params.action

  if (action === "set") {
    // "set" アクションの場合は新しいデータを追加
    const { key, data } = req.body

    if (!key || !data) {
      return res.status(400).send("Both key and data are required.")
    }

    // データベースに追加
    database[key] = data

    res.status(200).send("Data added successfully")
  } else if (action === "saveData") {
    // "saveData" アクションの場合はこれまでのデータをJSONファイルに保存
    fs.writeFile("database/database.json", JSON.stringify(database), (err) => {
      if (err) {
        console.error("Error writing to database file:", err)
        res.status(500).send("Internal Server Error")
      } else {
        res.status(200).send("Data saved successfully")
      }
    })
  } else {
    res.status(400).send('Invalid action. Please use "set" or "saveData".')
  }
})

// POSTリクエストを処理してデータベースからデータを削除
app.post("/database/remove/:key", (req, res) => {
  const key = req.params.key

  if (!key) {
    return res.status(400).send("Key parameter is required.")
  }

  // データベースからデータを削除
  delete database[key]
  res.status(200).send("Data removed successfully")
})

// POSTリクエストを処理して任意の階層にあるデータを取得
app.post("/database/get/:path", (req, res) => {
  const path = req.params.path

  if (!path) {
    return res.status(400).send("Path parameter is required.")
  }

  // データベースから指定されたパスにあるデータを取得
  const pathArray = path.split(".")
  let currentData = database

  for (const key of pathArray) {
    if (currentData.hasOwnProperty(key)) {
      currentData = currentData[key]
    } else {
      return res.status(404).send("Data not found for the provided path.")
    }
  }

  res.json({ path, data: currentData })
})

// サーバーを起動する
app.listen(apiport, () => {
  console.log(`Server is running on http://localhost:${apiport}`)
})