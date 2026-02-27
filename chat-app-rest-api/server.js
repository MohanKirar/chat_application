const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/socket/socket");

const PORT = process.env.PORT || 3000;

/**
 * Application bootstrap
 * 1. Connect DB
 * 2. Start HTTP server
 * 3. Initialize WebSocket
 */
const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
