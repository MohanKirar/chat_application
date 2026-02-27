const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");

authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    //  console.log("user:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.get(
      `accessToken:blacklist:${token}`
    );

    if (isBlacklisted) {
      return res.status(401).json({ message: "Session expired" });
      // check token exists in redis
      //redisToken = await redisClient.get(`accessToken:${decoded.userId}`);
    }

    // if (!redisToken || isBlacklisted || redisToken !== token) {
    //   return res.status(401).json({ message: "Session expired" });
    // }

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "....Unauthorized" });
  }
};

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     //  console.log("user:", authHeader);
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.userId }; // attach user to request

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

module.exports = authMiddleware;
