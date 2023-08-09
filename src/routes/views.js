import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		const response = await axios.get('http://localhost:8080/api/products')
		const products = response.data

		// Renderizar home.handlebars
		res.render('home', {
			products: products,
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

export default router
