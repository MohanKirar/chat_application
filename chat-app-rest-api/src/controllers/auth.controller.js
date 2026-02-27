const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const redisClient = require("../config/redis");

class authController {
  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Create user
      const user = await User.create({ name, email, password });
      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * POST /api/auth/login
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      /* ---------------- REDIS STORAGE ---------------- */

      // Access token – 15 minutes
      //  console.log(`accessToken:${user._id}`, "accessToken====>", accessToken);
      await redisClient.set(`accessToken:${user._id}`, accessToken, {
        EX: 60 * 15,
      });
      // Refresh token – 7 days
      await redisClient.set(`refresh:${user._id}`, refreshToken, {
        EX: 60 * 60 * 24 * 7,
      });

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  /**
   * POST /api/auth/refresh
   */
  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      const user = await User.findOne({ refreshToken });
      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
          }

          const newAccessToken = generateAccessToken(user._id);

          res.json({
            accessToken: newAccessToken,
          });
        }
      );
    } catch (error) {
      console.error("REFRESH ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // logout user
  logout = async (req, res) => {
    try {
      console.log("im logout");
      const authHeader = req.headers.authorization;
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.decode(accessToken);
      const userId = decoded.id || decoded.userId;
      //Blacklist access token in Redis
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);

      if (ttl > 0) {
        await redisClient.set(`accessToken:blacklist:${accessToken}`, "1", {
          EX: ttl,
        });
      }

      await redisClient.del(`refresh:${userId}`);
      // Add token to blacklist / Redis
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
module.exports = new authController();
// module.exports = {
//   register,
//   login,
//   refreshToken,
// };
