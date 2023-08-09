import express from 'express'
const router = express.Router()
import {
	createUser,
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,
} from '../dao/controllers/mongoose/usersController.js'

// Crear nuevo usuario
router.post('/', createUser)

// GET todos los usuarios
router.get('/', getAllUsers)

// Get usuario por ID
router.get('/:id', getUserById)

// Update user por ID
router.put('/:id', updateUserById)

// Delete user por ID
router.delete('/:id', deleteUserById)

export default router
