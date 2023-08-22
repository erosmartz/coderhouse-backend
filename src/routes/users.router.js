import express from 'express'
import { createUser } from '../dao/controllers/users.controller.js'

const router = express.Router()

router.post('/create', createUser)

export default router
