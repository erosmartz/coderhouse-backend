import { Router } from "express";
import productsController from "../controllers/productsController";

const router = Router();

router.get("/", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
