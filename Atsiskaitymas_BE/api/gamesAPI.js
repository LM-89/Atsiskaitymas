const express = require('express')
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('../controllers/gameController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', getGames)
router.get('/:id', getGameById)
router.post('/', authMiddleware, createGame)
router.put('/:id', authMiddleware, updateGame)
router.delete('/:id', authMiddleware, deleteGame)

module.exports = router