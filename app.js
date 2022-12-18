const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const cors = require("cors");
const config = require("./config/config").get(process.env.NODE_ENV);
const DB = require("./db/db");
const port = process.env.PORT || 4001;
const host = process.env.HOST;
const logger = require("morgan");
const path = require("path");
const _dirname = path.resolve();
var deeplink = require("node-deeplink");
const Message = require("./model/messageModel");
const {
  accessChat,
  addToGroup,
  allMessages,
  createGroupChat,
  fetchChats,
  messageThreds,
  removeFromGroup,
  renameGroup,
  sendMessage,
  sendMessage1,
  fetchChatsMobile,
  accessChatMobile,
  createGroupChatMobile,
} = require("./middlewares/chat");
const chat = require("./model/chatModel");
const socket = require("socket.io");
const mailerData = require("./middlewares/sendEmail");

// mailerData('saurabhnam360@gmail.com',"hello", `<h1>hello</h1>`)

process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local
const { PORTS, SOCKETURL } = config;
// requiring routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { async } = require("regenerator-runtime");
// Access-Control-Allow-Origin
app.use(cors({ origin: "*" }));

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  next(err);
});

//defining routes

app.use(express.static(_dirname));

app.use(userRoutes);
app.use(authRoutes);

DB();

app.get("/", (req, res) => {
  res.send("hello");
});

const server = app.listen(PORTS.API_PORT, () => {
  console.log("Server is listening on the port " + PORTS.API_PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: config.SOCKETURL.apiURL,
  },
});

io.sockets.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
  });
  // catching the message event

  socket.on("message", async (data) => {
    sendMessage(
      data.room,
      data.message.content,
      data.message.sender._id,
      data.message.attachments,
      data.message.isImportant
    );

    await io.in(data.room).emit("new message", {
      user: data.user,
      message: data.message,
    });
  });

  socket.on("fetch-chats", async (data) => {
    let usersData = await fetchChatsMobile(data.senderId);
    await io.in(data.senderId).emit("chat-history", usersData);
  });

  // Event when a client is typing
  socket.on("typing", (data) => {
    // Broadcasting to all the users except the one typing
    socket.broadcast
      .in(data.room)
      .emit("typing", { data: data, isTyping: true });
  });

  socket.on("access-chat", async (data) => {
    let checkData = await accessChatMobile(data.user_id, data.senderId);

    let usersData = await fetchChatsMobile(data.senderId);

    await io.in(data.senderId).emit("access-user-chat", checkData);
    await io.in(data.senderId).emit("chat-history", usersData);
  });

  socket.on("create-group", async (data) => {
    let createUSer = await createGroupChatMobile(
      data.user,
      data.name,
      data.senderId
    );

    data.user.map(async (el) => {
      let allData = await fetchChatsMobile(el);
      await io.in(el).emit("chat-history", allData);
    });
    await io.in(data.senderId).emit("access-user-group", createUSer);
  });
});
