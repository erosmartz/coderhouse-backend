import express from 'express'
import { messagesController } from '../dao/controllers/mongoose/messagesController.js'

const router = express.Router()

router.post('/send', messagesController.createMessage)
router.get('/get', messagesController.getAllMessages)

export default router
