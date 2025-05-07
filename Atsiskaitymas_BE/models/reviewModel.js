const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    feedback: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    },
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review