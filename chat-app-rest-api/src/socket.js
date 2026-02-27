const mongoose = require("mongoose");
const Chat = require("./models/Chat");
const Message = require("./models/Message");

// Map to store online users
// userId (string) -> socketId (string)
const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /**
     * USER JOINS (REGISTER SOCKET)
     * client emits: socket.emit("join", userId)
     */
    socket.on("join", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId.toString(), socket.id);
      console.log("👤 User online:", userId);
    });

    /**
     * SEND MESSAGE
     * client emits: socket.emit("sendMessage", payload)
     */
    socket.on("sendMessage", async (payload) => {
      try {
        const { chatId, senderId, receiverId, text, attachments } = payload;

        if (!senderId || !receiverId || (!text && !attachments?.length)) {
          return socket.emit("messageError", {
            message: "Invalid message data",
          });
        }

        const senderObjId = new mongoose.Types.ObjectId(senderId);
        const receiverObjId = new mongoose.Types.ObjectId(receiverId);

        // 1 Ensure chat exists
        let chat;
        if (chatId) {
          chat = await Chat.findById(chatId);
        } else {
          chat = await Chat.findOne({
            participants: { $all: [senderObjId, receiverObjId] },
          });

          if (!chat) {
            chat = await Chat.create({
              participants: [senderObjId, receiverObjId],
            });
          }
        }

        // 2️ Save message
        const message = await Message.create({
          chatId: chat._id,
          senderId: senderObjId,
          receiverId: receiverObjId,
          text,
          attachments,
        });

        // 3️ Update chat last message
        chat.lastMessage = message._id;
        await chat.save();

        // 4️ Emit to RECEIVER (if online)
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        // 5️ Emit to SENDER
        socket.emit("messageSent", message);
      } catch (error) {
        console.error("Socket sendMessage error:", error);
        socket.emit("messageError", {
          message: "Failed to send message",
        });
      }
    });

    /**
     * DISCONNECT
     */
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
