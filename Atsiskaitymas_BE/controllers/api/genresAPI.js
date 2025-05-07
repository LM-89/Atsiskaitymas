const express = require('express')
const { getGenres, getGenreById, createGenre, updateGenre, deleteGenre } = require('../controllers/genreController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', getGenres)
router.get('/:id', getGenreById)
router.post('/', authMiddleware, createGenre)
router.put('/:id', authMiddleware, updateGenre)
router.delete('/:id', authMiddleware, deleteGenre)

module.exports = router