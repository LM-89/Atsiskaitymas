const Game = require("../models/gameModel");

// Get all games
const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new game
const addGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a game
const updateGame = async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(updatedGame);
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a game
const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getGames,
  addGame,
  updateGame,
  deleteGame,
};