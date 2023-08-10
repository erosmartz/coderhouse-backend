import User from '../../models/users.model.js'

export const createUser = async (req, res) => {
	try {
		// Nuevo user
		const newUser = await User.create(req.body)
		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ error: 'Failed to create a new user' })
	}
}

export const getAllUsers = async (req, res) => {
	try {
		// GET todos los usuarios
		const users = await User.find()
		res.json(users)
	} catch (error) {
		res.status(500).json({ error: 'Failed to get all users' })
	}
}

export const getUserById = async (req, res) => {
	try {
		// GET user por ID
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}
		res.json(user)
	} catch (error) {
		res.status(500).json({ error: 'Failed to get the user' })
	}
}

export const updateUserById = async (req, res) => {
	try {
		// Update user por ID
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found' })
		}
		res.json(updatedUser)
	} catch (error) {
		res.status(500).json({ error: 'Failed to update the user' })
	}
}

export const deleteUserById = async (req, res) => {
	try {
		//Delete user por ID
		const deletedUser = await User.findByIdAndDelete(req.params.id)
		if (!deletedUser) {
			return res.status(404).json({ error: 'User not found' })
		}
		res.json({ message: 'User deleted successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete the user' })
	}
}
