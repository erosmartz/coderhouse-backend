import { Router } from 'express'
import cartsController from '../dao/controllers/mongoose/cartsController.js'

const router = Router()

router.post('/', cartsController.createCart)
router.get('/:cid', cartsController.getCartById)
router.post('/:cid/product/:pid', cartsController.addToCart)

export default router
