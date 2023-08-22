import express from 'express'
import { messagesController } from '../dao/controllers/messages.controller.js'

const router = express.Router()

router.post('/send', messagesController.createMessage)
router.get('/get', messagesController.getAllMessages)

export default router
