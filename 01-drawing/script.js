"use strict";

const mainLH = 3785;

var express = require("express");
var es6Renderer = require("express-es6-template-engine");
var http = require("http");
var morgan = require("morgan");

var app = express();
var server = http.createServer(app);

var { Server } = require("socket.io");
var io = new Server(server);

app.engine("html", es6Renderer);
app.set("views", "01-public");
app.set("view engine", "html");

app.use(morgan("dev"));
app.use("/socket-io", express.static("node_modules/socket.io/client-dist"));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.render("chat");
});

app.get("/draw", (req, res) => {
  res.render("frontend");
});

io.on("connection", (client) => {
  console.log("CONNECTED");

  client.on("disconnect", function () {
    console.log("EXITED");
  });

  // client.on('incoming', function(msg){
  //   io.emit('chat-msg', msg);
  // });

  client.on("drawing", function (msg) {
    console.log(msg);
  });

  client.on("join-room", function (room) {
    console.log("Joined Room", room);
    var p = client.join(room);
    io.to(room).emit("chat-msg", "**new user joined**");

    client.on("incoming", function (msg) {
      console.log(client.rooms);
      io.to(msg.room).emit("chat-msg", msg.msg);
    });
  });
});

server.listen(mainLH, () => {
  console.log("listening on *:mainLH");
});
