const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const uploadRoutes = require("./routes/upload.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(
  cors({
    origin: "*", // allow all (dev only)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/health", (req, res) => res.send("Working fine!"));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
//app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
