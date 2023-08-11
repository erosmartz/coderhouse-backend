import express from 'express'
import { createUser } from '../dao/controllers/mongoose/usersController.js'

const router = express.Router()

router.post('/create', createUser)

export default router
