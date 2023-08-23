import Cart from '../models/carts.model.js'

const cartsController = {
	// Get the user's cart
	getCart: async (req, res) => {
		try {
			const { username } = req.query

			// Find the cart document for the given username
			const cart = await Cart.findOne({ username }).populate({
				path: 'cartItems.productid',
				select: 'title price',
				populate: { path: 'thumbnails', options: { limit: 1 } },
			})

			if (!cart) {
				return res.status(404).json({ error: 'Carrito no encontrado.' })
			}

			console.log('cart:', cart)
			console.log('cartItems:', cart.cartItems)
			// Extract product information from populated cartItems
			const userCart = cart.cartItems.map((item) => {
				console.log('item:', item) // Add this console log

				const { _id, title, price, thumbnails, quantity } = item.productid

				const firstThumbnail = thumbnails?.[0]
				return {
					productid: _id,
					title,
					price,
					thumbnails: [firstThumbnail],
					quantity,
				}
			})

			console.log('userCart:', userCart) // Add this console log

			res.json(userCart)
		} catch (error) {
			console.log(error)
		}
	},

	// Create a new cart or return the existing one
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

	// Add a product to the cart
	addProductToCart: async (req, res) => {
		try {
			const pid = req.params.pid

			// Get the value of the 'username' key from localStorage via request body
			const { username } = req.body

			// Find the cart document
			const cart = await Cart.findOne({ username: username })

			// Check if the cart already has an item with the specified productId
			const existingItem = cart.cartItems.find((item) => item.productid === pid)

			if (existingItem) {
				// If an item with the productId already exists, increment the quantity by 1
				existingItem.quantity += 1
			} else {
				// If an item with the productId does not exist, create a new item with quantity 1
				cart.cartItems.push({ productid: pid, quantity: 1 })
			}

			// Save the updated cart document
			await cart.save()

			// Return the updated cart
			res.status(200).json(cart)
		} catch (error) {
			// Handle any errors
			console.error(error)
			res.status(500).json({ error: 'Internal server error' })
		}
	},
}

export default cartsController
