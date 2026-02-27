const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { getIO } = require("../../src/socket/socket");
class ChatController {
  /**
   * Send message (1-to-1)
   */
  sendMessage = async (req, res) => {
    const { chatId, receiverId, text } = req.body;
    const senderId = req.user.id;
    //console.log("===>", chatId);
    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false,
    });

    // Create chat if not exists
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        isGroup: false,
      });
    }

    //console.log("Chat", chat);
    const message = await Message.create({
      chatId: chat._id,
      senderId,
      receiverId,
      text,
    });

    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: message._id,
    });

    const io = getIO(); // emit from server

    io.to(receiverId.toString()).emit("receive-message", message);
    io.to(senderId.toString()).emit("message-sent", message);
    res.status(201).json({ data: message });
  };

  /**
   * Get messages between logged-in user and receiver
   */
  getMessages = async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.params.chatId;
    // console.log("Sender:", senderId);
    //console.log("receiverId:", receiverId);

    //  Find chat
    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false,
    });

    if (!chat) {
      return res.status(200).json({
        chatId: null,
        messages: [],
      });
    }

    // Get messages
    const messages = await Message.find({ chatId: chat._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      chatId: chat._id,
      messages,
    });
  };
}
module.exports = new ChatController();
