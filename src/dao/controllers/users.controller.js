import User from '../models/users.model.js'

export const createUser = async (req, res) => {
	const { username } = req.body

	// Check if the username already exists
	const existingUser = await User.findOne({ username })
	if (existingUser) {
		return res.status(409).json({ error: 'Username already taken' })
	}

	// Create a new user document
	const newUser = new User({ username })
	await newUser.save()

	return res.status(201).json({ message: 'User created successfully' })
}
