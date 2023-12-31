//import tools
import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'

//import custom modules
import { __dirname } from './utils.js'

// import routers
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import usersRouter from './routes/users.router.js'
import messagesRouter from './routes/messages.router.js'

// import handlers
import handleWebsockets from './handlers/websockets.js'

//import mongoDB stuff
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// env variables
dotenv.config()
const mongoKey = process.env.DB_KEY

// mongoDB connection
;(async () => {
	try {
		await mongoose.connect(mongoKey, { dbName: 'ecommerce' })
		console.log('Server: mongoDB Atlas - connected.')
	} catch (error) {
		console.log('Cannot connect to the database: ' + error)
		process.exit(1)
	}
})()

//set globals
const app = express()

// Server HTTP
const PORT = 8080
const httpServer = app.listen(PORT, () => {
	console.log(`Server: Escuchando en el puerto ${PORT}`)
})

//Websocket
const io = new Server(httpServer)
console.log('Server: Servidor de Websocket iniciado.')

//Websocket connection
io.on('connection', (socket) => {
	console.log('Server: Nuevo cliente conectado.')
})

//Websocket server-side Handlers
handleWebsockets(io)

//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//tool modules
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(express.json())

//api routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartsRouter)

//users routes
app.use('/api/users', usersRouter)

//messages routes
app.use('/api/messages', messagesRouter)

//default routes
app.use('/', viewsRouter)
app.use('/realtimeproducts', viewsRouter)
