module.exports = (rinfo, message, databaseAPI, net) => {
  console.log("garlicNET-StartUp");

  const sequence = {};
  sequence.getServer = (data) => {
    databaseAPI.get(`server.${data.request.uuid}`, (data) => {
      console.log(data);

      const ip = rinfo.address;
      const port = rinfo.port;
      net.send(ip, port, {
        typeNET: "garlic",
        request: { resServer: true, data: data },
      });
    });
  };

  sequence.getProfile = (data) => {
    databaseAPI.get(`profile`, (data) => {
      console.log(data);

      const ip = rinfo.address;
      const port = rinfo.port;
      net.send(ip, port, {
        typeNET: "garlic",
        request: { resProfile: true, data: data },
      });
    });
  };

  sequence.getThread = (data) => {
    console.log(data.uuid);
    databaseAPI.get(`threadData.${data.request.uuid}`, (data) => {
      console.log(data);

      const ip = rinfo.address;
      const port = rinfo.port;
      net.send(ip, port, {
        typeNET: "garlic",
        request: { resThread: true, data: data },
      });
    });
  };

  sequence.getMoment = (data) => {
    console.log("getMoment");
    databaseAPI.get(`momentData.${data.request.uuid}`, (data) => {
      console.log(data);

      const ip = rinfo.address;
      const port = rinfo.port;
      net.send(ip, port, {
        typeNET: "garlic",
        request: { resMoment: true, data: data },
      });
    });
  };

  sequence.getInstantProfile = (data) => {
    console.log("getInstantProfile");
    databaseAPI.get(`profile`, (data) => {
      console.log(data);

      delete data.data.myThread;
      delete data.data.myMoment;

      const ip = rinfo.address;
      const port = rinfo.port;
      net.send(ip, port, {
        typeNET: "garlic",
        request: { resInstantProfile: true, data: data },
      });
    });
  };

  sequence.getInstantServer = (data) => {
    console.log(data);
    databaseAPI.get(`server.${data.request.uuid}.title`, (title) => {
      console.log(title);

      databaseAPI.get(`server.${data.request.uuid}.about`, (about) => {
        const ip = rinfo.address;
        const port = rinfo.port;
        console.log(about);
        net.send(ip, port, {
          typeNET: "garlic",
          request: {
            resInstantServer: true,
            data: { data: { about: about.data, title: title.data } },
          },
        });
      });
    });
  };

  console.log(message.request.getMoment);

  if (message.request.getServer) {
    sequence.getServer(message);
  } else if (message.request.getProfile) {
    sequence.getProfile(message);
  } else if (message.request.getThread) {
    sequence.getThread(message);
  } else if (message.request.getMoment) {
    sequence.getMoment(message);
  } else if (message.request.getServer) {
    sequence.getServer(message);
  } else if (message.request.getInstantProfile) {
    sequence.getInstantProfile(message);
  } else if (message.request.getInstantServer) {
    sequence.getInstantServer(message);
  }
};
