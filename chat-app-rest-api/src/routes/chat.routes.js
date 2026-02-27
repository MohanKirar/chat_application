const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Send a chat message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 example: "64f1a2c9e1a9c1"
 *               receiverId:
 *                 type: string
 *                 example: "64f1a2c9e1a9c2"
 *               message:
 *                 type: string
 *                 example: "Hello"
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
// router.post("/send", (req, res) => {
//   res.status(200).json({ message: "Chat message sent" });
// });

router.post("/send", authMiddleware, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/{chatId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Get messages for a chat
 *     description: Fetch all messages for a given chat ID
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique chat identifier
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   senderId:
 *                     type: string
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Chat not found
 */
router.get("/:chatId", authMiddleware, chatController.getMessages);

module.exports = router;
