import Cart from '../../models/Cart.model.js'

const cartsController = {
	getCartById: async (req, res) => {
		const { cid } = req.params

		try {
			const cart = await Cart.findById(cid)

			if (cart) {
				res.json(cart.toObject())
			} else {
				res.status(404).json({ error: 'Carrito no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la función getCartById' })
		}
	},
	createCart: async (req, res) => {
		const { userId } = req.body

		try {
			const newCart = new Cart({
				userId,
				products: [],
			})

			await newCart.save()

			res.status(201).json(newCart.toObject())
		} catch {
			res.status(500).json({ error: 'Error en la función createCart' })
		}
	},
	addToCart: async (req, res) => {
		const { cid } = req.params
		const { productId, quantity } = req.body

		try {
			const cart = await Cart.findById(cid)

			if (cart) {
				const productInfo = await getProductInfo(productId)

				if (productInfo) {
					const productToAdd = {
						productId,
						quantity,
						...productInfo,
					}

					cart.products.push(productToAdd)

					await cart.save()

					res.json(cart.toObject())
				} else {
					res.status(404).json({ error: 'Producto no encontrado' })
				}
			} else {
				res.status(404).json({ error: 'Carrito no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la función addToCart' })
		}
	},
	removeFromCart: async (req, res) => {
		const { cid } = req.params
		const { productId } = req.body

		try {
			const cart = await Cart.findById(cid)

			if (cart) {
				const index = cart.products.findIndex((p) => p.productId === productId)

				if (index !== -1) {
					cart.products.splice(index, 1)

					await cart.save()

					res.json(cart.toObject())
				} else {
					res
						.status(404)
						.json({ error: 'Producto no encontrado en el carrito' })
				}
			} else {
				res.status(404).json({ error: 'Carrito no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la función removeFromCart' })
		}
	},
}

export default cartsController
