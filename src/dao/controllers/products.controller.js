import Product from '../models/products.model.js'

const productsController = {
	getAllProducts: async (req, res) => {
		const { limit = 10, page = 1, sort, genre } = req.query
		const query = {}

		// Apply filters based on query parameters
		if (genre) {
			query.category = genre
		}

		try {
			const options = {
				page: Number(page),
				limit: Number(limit),
				sort: sort,
			}

			const products = await Product.paginate(query, options)

			res.json(products)
		} catch (error) {
			console.error('Error retrieving products:', error)
			res.status(500).json({ error: 'Error retrieving products' })
		}
	},
	getProductById: async (req, res) => {
		const { pid } = req.params

		try {
			const product = await Product.findById(pid)

			if (product) {
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
			const newProduct = new Product({
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
