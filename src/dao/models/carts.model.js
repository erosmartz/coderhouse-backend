import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		cartItems: [
			{
				productid: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
	},
	{ timestamps: true }
)

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
