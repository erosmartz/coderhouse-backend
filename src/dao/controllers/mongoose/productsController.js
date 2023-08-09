import { generateUniqueId } from '../../../utils.js'
import Product from '../../models/products.model.js'

const productsController = {
	getAllProducts: async (req, res) => {
		const { limit } = req.query
		const genericThumbnail = '/img/movies/unknown.jpg'

		try {
			const products = await Product.find()

			const limitedProducts =
				limit && Number.isInteger(Number(limit)) && Number(limit) > 0
					? products.slice(0, Number(limit))
					: products

			const productsWithThumbnails = await Promise.all(
				limitedProducts.map(async (product) => {
					const thumbnails = product.thumbnails || []
					if (!thumbnails.length || !(await fileExists(thumbnails[0]))) {
						return { ...product.toObject(), thumbnails: [genericThumbnail] }
					}
					return product.toObject()
				})
			)

			res.json(productsWithThumbnails)
		} catch {
			res.status(500).json({ error: 'Error en la funcion getAllProducts' })
		}
	},
	getProductById: async (req, res) => {
		const { pid } = req.params
		const genericThumbnail = '/img/movies/unknown.jpg'

		try {
			const product = await Product.findById(pid)

			if (product) {
				const thumbnails = product.thumbnails || []
				if (!thumbnails.length || !(await fileExists(thumbnails[0]))) {
					product.thumbnails = [genericThumbnail]
				}
				res.json(product.toObject())
			} else {
				res.status(404).json({ error: 'Producto no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la funcion getProductById' })
		}
	},
	addProduct: async (req, res) => {
		const {
			title,
			description,
			code,
			price,
			status = true,
			stock,
			category,
			thumbnails = [],
		} = req.body

		console.log(
			'Server(Controller): Se ha recibido el producto desde websocket. Agregando..',
			req.body
		)

		try {
			const id = generateUniqueId()

			const newProduct = new Product({
				id,
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnails,
			})

			await newProduct.save()

			console.log('Server(Controller): Producto agregado satisfactoriamente.')

			res.status(201).json(newProduct.toObject())
		} catch (error) {
			console.error(
				'Server(Controller): Error agregando producto.',
				error.message
			)

			res.status(500).json({ error: 'Error en la funcion addProduct' })
		}
	},
	updateProduct: async (req, res) => {
		const { pid } = req.params
		const updatedFields = req.body

		try {
			const product = await Product.findByIdAndUpdate(pid, updatedFields, {
				new: true,
			})

			if (product) {
				res.json(product.toObject())
			} else {
				res.status(404).json({ error: 'Producto no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la funcion updateProduct' })
		}
	},
	deleteProduct: async (req, res) => {
		const { pid } = req.params
		try {
			const product = await Product.findByIdAndDelete(pid)

			if (product) {
				res.json(product.toObject())
			} else {
				res.status(404).json({ error: 'Producto no encontrado' })
			}
		} catch {
			res.status(500).json({ error: 'Error en la funcion deleteProduct' })
		}
	},
}

export default productsController
