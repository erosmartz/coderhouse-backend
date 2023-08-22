import { Router } from 'express'
import cartsController from '../dao/controllers/carts.controller.js'

const router = Router()

/* router.get('/:cid', cartsController.getCart) */
router.post('/', cartsController.createCart)
/* router.put('/:cid', cartsController.updateCart)
router.delete('/:cid', cartsController.removeCart)

router.post('/products/:pid', cartsController.addProductToCart)
router.put('/products/:pid', cartsController.updateProductFromCart)
router.delete('/products/:pid', cartsController.removeProductFromCart) */

export default router
