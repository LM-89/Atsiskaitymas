const mongoose = require('mongoose')
const ROLES = require('../config/roles')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value)
            },
            message: props => `${props.value} is not a valid name`
        },
    },

    surname: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value)
            },
            message: props => `${props.value} is not a valid surname`
        },
    },

    username: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value)
            },
            message: props => `${props.value} is not a valid username`
        },
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: value => {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            },
            message: ({ value }) => {
                return `${value} is not a valid email.`
            }
        },
    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 0,
    },

    bio: {
        type: String,
    },

    avatar: {
        type: String,
        trim: true,
    },

    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER,
    },

    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Review',
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User