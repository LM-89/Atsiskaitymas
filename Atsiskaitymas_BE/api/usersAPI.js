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

router.put("/:id", authMiddleware, updateUser);

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authMiddleware, deleteUser);

// Add the route for updating user roles (Admin only)
router.patch("/:id/role", authMiddleware, rolesMiddleware("ADMIN"), updateUserRole);

router.get("/me", authMiddleware, async (req, res) => {
    try {
        // req.user should have the user's id (set by authMiddleware)
        const user = await User.findById(req.user._id).select("-password"); // don't send password
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;