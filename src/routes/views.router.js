import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/cart', async (req, res) => {
	try {
		const username = req.query.username // Retrieve the username from the query parameters
		const response = await axios.get('http://localhost:8080/api/cart', {
			params: { username }, // Pass the username as a query parameter
		})

		const cart = response.data

		// Check if the 'list' parameter is null or undefined and set it to false if needed
		const list =
			req.query.list === null || req.query.list === undefined
				? false
				: req.query.list

		res.render('cart', {
			cart: cart,
			list: list,
			style: 'cart.css',
		})
	} catch (error) {
		console.error('Error retrieving cart:', error)
		res.status(500).json({ error: 'Error retrieving cart' })
	}
})

router.get('/', async (req, res) => {
	try {
		const { page, sort, genre, limit } = req.query

		const response = await axios.get('http://localhost:8080/api/products', {
			params: {
				page: page || 1,
				sort,
				genre,
				limit,
			},
		})

		const products = response.data.docs

		const paginationInfo = {
			totalDocs: response.data.totalDocs,
			limit: response.data.limit,
			totalPages: response.data.totalPages,
			page: response.data.page,
			pagingCounter: response.data.pagingCounter,
			hasPrevPage: response.data.hasPrevPage,
			hasNextPage: response.data.hasNextPage,
			prevPage: response.data.prevPage,
			nextPage: response.data.nextPage,
		}

		const params = { page, sort, genre, limit }

		// Renderizar home.handlebars
		res.render('home', {
			products: products,
			paginationInfo: paginationInfo,
			params: params,
			style: 'home.css',
		})
	} catch (err) {
		console.error('Error retrieving products:', err)
		res.status(500).json({ error: 'Error retrieving products' })
	}
})

// Conexion WebSocket en realtime
router.get('/realtimeproducts', async (req, res) => {
	try {
		const response = await axios.get('http://localhost:8080/api/products')
		const products = response.data

		// Renderizar realtimeproducts.handlebars
		res.render('realtimeproducts', {
			products: products,
			style: 'realtimeproducts.css',
		})
	} catch (error) {
		console.error('Error retrieving products:', error)
		res.status(500).json({ error: 'Error retrieving products' })
	}
})

// Conexion chat WebSocket
router.get('/chat', (req, res) => {
	res.render('chat', { style: 'chat.css' })
})

export default router
