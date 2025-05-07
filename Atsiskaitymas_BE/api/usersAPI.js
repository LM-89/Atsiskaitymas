const express = require("express");
const User = require("../models/userModel");

const {
  register,
  login,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
    try {
        console.log("Decoded user in /me:", req.user);
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", authMiddleware, updateUser);

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authMiddleware, deleteUser);

router.patch("/:id/role", authMiddleware, rolesMiddleware("ADMIN"), updateUserRole);

module.exports = router;