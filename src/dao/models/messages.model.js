import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
	// schema fields for the 'messages' collection
	sender: { type: String, required: true },
	recipient: { type: String, required: true },
	content: { type: String, required: true },
})

const Message = mongoose.model('messages', messageSchema)

export default Message
