const { Server } = require("socket.io");

let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      //console.log("User joined room:", userId);
      //console.log("User====> joined room:", chatId);
      socket.join(chatId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
