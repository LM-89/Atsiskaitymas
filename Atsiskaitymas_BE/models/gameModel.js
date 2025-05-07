const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true,
    },

    developer: {
        type: String,
        required: true,
    },

    release: {
        type: Number,
        required: true,
    },
    
    price: {
        type: Number,
        required: true,
    },
    
    cover: {
        type: String,
        required: true,
    },
    
    video: {
        type: String,
        required:true,
        trim: true,
    },
    
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },

    genres: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Genre',
        required: true,
    },
}, { timestamps: true })

const Game = mongoose.model('Game', gameSchema)

module.exports = Game