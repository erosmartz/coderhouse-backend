import Cart from '../models/carts.model.js'

const cartsController = {
	createCart: async (req, res) => {
		try {
			const { username } = req.body

			// Check if a cart already exists for the user
			let cart = await Cart.findOne({ username })

			if (cart) {
				// A cart already exists for the user, return the cart data
				console.log(
					`Carrito existente para usuario ${username}, retornando datos del carrito...`
				)
				console.log(`Datos del carrito: ${JSON.stringify(cart, null, 2)}`)
				return res.status(200).json(cart)
			} else {
				// Create a new cart
				cart = new Cart({ username, cartItems: [] })
				await cart.save()

				// Return the newly created cart
				res.status(201).json(cart)
				console.log('Nuevo carrito vacio creado para el usuario' + username)
			}
		} catch (error) {
			// Handle any errors
			console.error(error)
			res.status(500).json({ error: 'Internal server error' })
		}
	},
	// Rest of the controller methods...
}

export default cartsController
