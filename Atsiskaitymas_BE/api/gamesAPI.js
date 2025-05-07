const express = require("express");
const { getGames, addGame, updateGame, deleteGame } = require("../controllers/gameController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getGames);
router.post("/", authMiddleware, addGame);
router.put("/:id", authMiddleware, updateGame);
router.delete("/:id", authMiddleware, deleteGame);

module.exports = router;