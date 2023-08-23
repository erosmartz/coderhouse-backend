import { Router } from 'express'
import cartsController from '../dao/controllers/carts.controller.js'

const router = Router()

router.get('/', cartsController.getCart)
router.post('/', cartsController.createCart)
/* router.put('/:cid', cartsController.updateCart)
router.delete('/:cid', cartsController.removeCart) */

router.put('/products/add/:pid', cartsController.addProductToCart)
/* router.delete('/products/:pid', cartsController.removeProductToCart) */

export default router
