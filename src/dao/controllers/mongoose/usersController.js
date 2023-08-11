import User from '../../models/users.model.js'

export const createUser = async (req, res) => {
	const { first_name, last_name, email } = req.body

	// Check if the email already exists
	const existingUser = await User.findOne({ email })
	if (existingUser) {
		return res.status(409).json({ error: 'Email already taken' })
	}

	// Create a new user document
	const newUser = new User({ first_name, last_name, email })
	await newUser.save()

	return res.status(201).json({ message: 'User created successfully' })
}
