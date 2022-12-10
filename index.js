const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { router, setSocketIo } = require("./api");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
setSocketIo(io);
app.use("/", router);
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
