const express = require('express')
const process = require('process')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
require('./db')

// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Project API is running!' })
})

const gamesApiRoutes = require('./api/gamesAPI')
const genresApiRoutes = require('./api/genresAPI')
const reviewsApiRoutes = require('./api/reviewsAPI')
const usersApiRoutes = require('./api/usersAPI')

app.use('/games', gamesApiRoutes)
app.use('/genres', genresApiRoutes)
app.use('/reviews', reviewsApiRoutes)
app.use('/users', usersApiRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on port: '.italic.brightMagenta + `${PORT}`.italic.yellow))