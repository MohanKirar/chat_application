const User = require("../models/user.model");

class userController {
  /**
   * GET /api/users
   * Returns all users
   */
  getUsers = async (req, res) => {
    try {
      const users = await User.find(
        { _id: { $ne: req.user.id } },
        "_id name email"
      );
      res.json(users);
    } catch (error) {
      console.error("GET USERS ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
module.exports = new userController();
