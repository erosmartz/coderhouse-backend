import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
	// schema fields for the 'carts' collection
	userId: { type: String, required: true },
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
})

const Cart = mongoose.model('carts', cartSchema)

export default Cart
