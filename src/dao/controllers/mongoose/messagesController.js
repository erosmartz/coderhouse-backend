import Message from '../models/message'

export const messagesController = {
	getAllMessages: async (req, res) => {
		try {
			const messages = await Message.find()
			res.json(messages)
		} catch (error) {
			res.status(500).json({ error: 'Error retrieving messages' })
		}
	},

	createMessage: async (io, socket, data) => {
		const { sender, recipient, content } = data
		const newMessage = new Message({ sender, recipient, content })
		try {
			const savedMessage = await newMessage.save()
			io.emit('newMessage', savedMessage)
		} catch (error) {
			console.error('Error creating message:', error)
		}
	},
}
