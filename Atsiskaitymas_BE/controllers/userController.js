const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const process = require('process')

const User = require("../models/userModel")
const ALLOWED_UPDATES = require('../config/userUpdates')

const register = async (req, res) => {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        const message = existingUser.email === email
            ? 'Email already exists'
            : 'Username already exists'
        return res.status(400).send({ message })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign(
            {
                username: newUser.username,
                email: newUser.email,
                id: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.send({ message: 'User registered successfully', token })
    } catch (error) {
        res.status(500).send(error)
    }
}


const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({ message: 'Invalid email or password' })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        )

        

        res.send({ message: 'User Successfully Logged In', token, username: user.username })
    } catch (error) {
        res.status(500).send(error)
    }
}


const updateUser = async (req, res) => {
    const { id } = req.user
    const updates = {}
    const requested = Object.keys(req.body)
  
    requested.forEach(field => {
      if (ALLOWED_UPDATES.includes(field)) {
        updates[field] = req.body[field]
      }
    })
  
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .send({ message: 'No valid fields to update' })
    }

    if (updates.password) {
        if (!req.body.currentPassword) {
            return res.status(400).send({ message: 'Current password is required to change the password.' })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ message: 'User not found.' })
        }

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Current password is incorrect.' })
        }

        const hashed = await bcrypt.hash(updates.password, 10)
        updates.password = hashed
    }
  
    try {
      const user = await User.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      )
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }
  
      res.send({
        message: 'User successfully updated',
        user
      })
    } catch (err) {
      res.status(500).send(err)
    }
}


const getUsers = async (req, res) => {
    try {
        const users = await User.find()

        res.send(users)

    } catch (error) {
        res.status(500).send(error)
    }
}


const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        res.send(user)
        
    } catch (error) {
        res.status(500).send(error)
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return res.status(404).send({ error: 'User not found.' })
        }

        res.send({ message: 'User record was removed', data: deletedUser })

    } catch (error) {
        res.status(500).send(error)
    }
}


const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from the request parameters
        const { role } = req.body; // Get the new role from the request body

        // Validate the role
        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).send({ message: 'Invalid role' });
        }

        // Update the user's role in the database
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.send({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole, // Add the new function here
};