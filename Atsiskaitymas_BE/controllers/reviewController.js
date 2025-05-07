const Review = require('../models/reviewModel')

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('game', 'title')//.populate('user', 'name')            

        res.send(reviews)

    } catch (error) {
        res.status(500).send(error)
    }
}


const getReviewById = async (req, res) => {
    try {
        const { id } = req.params
        const review = await Review.findById(id).populate('game', 'title')//.populate('user', 'name')        
        if (!review) {
            return res.status(404).send({ error: 'Review not found' })
        }

        res.send(review)
        
    } catch (error) {
        res.status(500).send(error)
    }
}


const createReview = async (req, res) => {
    try {
        const review = new Review(req.body)
        await review.save()
        res.send(review)

    } catch (error) {
        res.status(500).send(error)
    }
}


const updateReview = async (req, res) => {
    try {
        const { id } = req.params

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )

        if (!updatedReview) {
            return res.status(404).send({ error: 'Review not found' })
        }

        res.send(updatedReview)

    } catch (error) {
        res.status(500).send(error)
    }
}


const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const deletedReview = await Review.findByIdAndDelete(id)

        if (!deletedReview) {
            return res.status(404).send({ error: 'Review not found.' })
        }

        res.send({ message: 'Review record was removed', data: deletedReview })

    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
}