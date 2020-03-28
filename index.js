const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketio(server);
io.on("connect", socket => {
  socket.emit('message', 'Welcome!');
  //send to other users
  socket.broadcast.emit("message", "new connected");
})

app.use(bodyParser.json());
app.use(cors());
const api = require("./api");
app.use("/", api);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
