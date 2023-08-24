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

			// Extract product information from populated cartItems
			const userCart = cart.cartItems.map((item) => {
				const { quantity } = item
				const { _id, title, price, thumbnails } = item.productid
				const firstThumbnail = thumbnails?.[0]
				return {
					productid: _id,
					title,
					price,
					thumbnails: [firstThumbnail],
					quantity,
				}
			})

			res.json(userCart)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal server error' })
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
				return res.status(200).json(cart)
			} else {
				// Create a new cart
				cart = new Cart({ username, cartItems: [] })
				await cart.save()

				// Return the newly created cart
				res.status(201).json(cart)
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

			// Find the index of the existing item in the cartItems array
			const existingItemIndex = cart.cartItems.findIndex(
				(item) => item.productid.toString() === pid
			)

			if (existingItemIndex !== -1) {
				// If an item with the productId already exists, increment the quantity by 1
				cart.cartItems[existingItemIndex].quantity += 1
			} else {
				// If an item with the productId does not exist, create a new item with quantity 1
				cart.cartItems.push({ productid: pid, quantity: 1 })
			}

			// Save the updated cart document
			await cart.save()

			// Return the updated cart
			res.status(200).json(cart)
		} catch (error) {
			console.error('Error adding product to cart:', error)
			res.status(500).json({ error: 'Error adding product to cart' })
		}
	},

	updateProductFromCart: async (req, res) => {
		try {
			const { username, productid, update } = req.query

			// Find the cart document
			const cart = await Cart.findOne({ username: username })

			// Find the index of the product in the cartItems array
			const productIndex = cart.cartItems.findIndex(
				(item) => item.productid.toString() === productid
			)

			if (productIndex !== -1) {
				if (update === 'increment') {
					// Increment the quantity by 1
					cart.cartItems[productIndex].quantity += 1
				} else if (update === 'decrement') {
					// Decrement the quantity by 1
					cart.cartItems[productIndex].quantity -= 1

					if (cart.cartItems[productIndex].quantity === 0) {
						// Remove the product from the cart if the quantity becomes 0
						cart.cartItems.splice(productIndex, 1)
					}
				}

				// Save the updated cart document
				await cart.save()

				res.status(200).json(cart)
			} else {
				res.status(404).json({ error: 'Product not found in cart' })
			}
		} catch (error) {
			console.error('Error updating product from cart:', error)
			res.status(500).json({ error: 'Error updating product from cart' })
		}
	},
}

export default cartsController
