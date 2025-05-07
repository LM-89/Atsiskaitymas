const express = require('express')
const { getReviews, getReviewById, createReview, updateReview, deleteReview } = require('../controllers/reviewController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', getReviews)
router.get('/:id', getReviewById)
router.post('/', authMiddleware, createReview)
router.put('/:id', authMiddleware, updateReview)
router.delete('/:id', authMiddleware, deleteReview)

module.exports = router