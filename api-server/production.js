// hello-server-attach.js
var PORT = process.env.PORT || 2403;
var ENV = process.env.NODE_ENV || "development";

// setup http + express + socket.io
var fs = require("fs");
var express = require("express");
var app = express();

var privateKey = fs.readFileSync("./privkey.pem", "utf8");
var certificate = fs.readFileSync("./cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

var server = require("https").createServer(credentials, app);
var io = require("socket.io").listen(server, { "log level": 0 });

// setup deployd
require("deployd").attach(server, {
  socketIo: io, // if not provided, attach will create one for you.
  env: ENV,
  db: {
    host: "localhost",
    port: 27017,
    name: "todos",
    credentials: {
      username: "deployd",
      password: ""
    }
  }
});

// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest);

// start server
server.listen(PORT);
