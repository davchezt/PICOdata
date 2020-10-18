const express     = require("express"),
      app         = express(),
      http        = require("http").Server(app),
      morgan      = require("morgan"),
      bodyParser  = require("body-parser"),
      os          = require('os'),
      path        = require('path');

Date.prototype.toUnixTime = function() {
  return (this.getTime() / 1000) | 0;
};
Date.time = function() {
  return new Date().toUnixTime();
};

const indexControllers = require('./controller');
const apiController = require('./api');

const ip = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Middleware
const requestMiddleware = (req, res, next) => {
  req.requestTime = Date.now();
  next();
}

app.use(requestMiddleware);
app.use(morgan('combined', {
  skip: (req, res, next) => { return res.statusCode < 400 }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("json spaces", 2); // pretty print

app.use("/", indexControllers);
app.use("/api", apiController);

// Handle 404
app.use((req, res, next) => {
  const error = new Error("Error 404");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    "status": error.status || 500,
    error: {
      message: error.message
    }
  });
  console.log("get " + error.message);
});

http.listen(port, ip, () => {
  console.log('\x1b[43m\x1b[30m%s\x1b[0m', 'SignalingServer berjalan di:');
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        console.log('\x1b[36m', '\t' + ifname + ':' + alias + ' @ ' + iface.address + ':' + port, '\x1b[0m');
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log('\x1b[36m', '\t' + ifname + ':' + alias + ' @ http://' + iface.address + ':' + port, '\x1b[0m');
      } else {
        // this interface has only one ipv4 adress
        console.log('\x1b[36m', '\t' + ifname + ' @ http://' + iface.address + ':' + port, '\x1b[0m');
      }
      ++alias;
    });
  });
});