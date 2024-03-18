module.exports = (req, res, databaseAPI, net) => {
  console.log("garlicAPI-StartUp");

  const garlic = {};

  //ホーム画面のレンダリング(restAPI)
  garlic.getHome = () => {
    console.log("getHome");
    return new Promise((resolve, reject) => {
      databaseAPI.get("home", (data) => {
        console.log(data);
        resolve(data.data); // データを解決する
      });
    });
  };

  //サーバー画面のレンダリング(restAPI -> netAPI)
  garlic.getNetServer = () => {
    console.log("getServer");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getServer: true, uuid: req.query.uuid },
    });

    return new Promise((resolve, reject) => {
      net.on("resServer", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //プロフィールの要求(restAPI -> NetAPI)
  garlic.getNetProfile = () => {
    console.log("getProfile");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getProfile: true },
    });

    return new Promise((resolve, reject) => {
      net.on("resProfile", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //スレッドをレンダリング(restAPI -> NetAPI)
  garlic.getNetThread = () => {
    console.log("getThread");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getThread: true, uuid: req.query.uuid },
    });

    return new Promise((resolve, reject) => {
      net.on("resThread", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //モーメントをレンダリング(restAPI -> NetAPI)
  garlic.getNetMoment = () => {
    console.log("getMoment");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getMoment: true, uuid: req.query.uuid },
    });
    console.log("getMoment");

    return new Promise((resolve, reject) => {
      net.on("resMoment", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //プロフィールをインスタントレンダリング(restAPI -> NetAPI)
  garlic.getNetInstantProfile = () => {
    console.log("getNetInstantProfile");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getInstantProfile: true },
    });

    return new Promise((resolve, reject) => {
      net.on("resInstantProfile", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //自分の情報をインスタントレンダリング(restAPI -> NetAPI)
  garlic.getNetInstantMe = () => {
    console.log("getNetInstantMe");

    return new Promise((resolve, reject) => {
      databaseAPI.get("home", (data) => {

        delete data.data.Threads;
        delete data.data.Moment;
        console.log(data.data);
        resolve(data.data); // データを解決する
      });
    });
  };

  //サーバーの情報をインスタントレンダリング(restAPI -> NetAPI)
  garlic.getNetInstantServer = () => {
    console.log("getNetInstantServer");
    const ip = req.query.ip;
    const port = req.query.port;
    //リクエストを作成。
    net.send(ip, port, {
      typeNET: "garlic",
      request: { getInstantServer: true, uuid: req.query.uuid },
    });

    return new Promise((resolve, reject) => {
      net.on("resInstantServer", (request) => {
        console.log(request.request.data.data);
        resolve(request.request.data.data);
      });
    });
  };

  //garlicAPIの実行
  garlic[req.query.garlic]()
    .then((data) => {
      res.send(data); // データが利用可能になったらレスポンスを返す
    })
    .catch((error) => {
      console.error(error); // エラーハンドリング
    });
};
