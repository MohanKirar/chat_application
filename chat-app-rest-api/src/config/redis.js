const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379", // change if using cloud redis
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch(console.error);

module.exports = redisClient;
