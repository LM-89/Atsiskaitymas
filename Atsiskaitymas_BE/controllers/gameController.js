const Game = require('../models/gameModel')

const getGames = async (req, res) => {
    try {
        const games = await Game.find().populate('genres', 'title').populate('developer', 'name')

        res.send(games)

    } catch (error) {
        res.status(500).send(error)
    }
}


const getGameById = async (req, res) => {
    try {
        const { id } = req.params
        const game = await Game.findById(id).populate('genres', 'title').populate('developer', 'name')
        if (!game) {
            return res.status(404).send({ error: 'Game not found' })
        }

        res.send(game)
        
    } catch (error) {
        res.status(500).send(error)
    }
}


const createGame = async (req, res) => {
    try {
        const game = new Game(req.body)
        await game.save()
        res.send(game)

    } catch (error) {
        res.status(500).send(error)
    }
}


const updateGame = async (req, res) => {
    try {
        const { id } = req.params

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )

        if (!updatedGame) {
            return res.status(404).send({ error: 'Game not found' })
        }

        res.send(updatedGame)

    } catch (error) {
        res.status(500).send(error)
    }
}


const deleteGame = async (req, res) => {
    try {
        const { id } = req.params
        const deletedGame = await Game.findByIdAndDelete(id)

        if (!deletedGame) {
            return res.status(404).send({ error: 'Game not found.' })
        }

        res.send({ message: 'Game record was removed', data: deletedGame })

    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
}