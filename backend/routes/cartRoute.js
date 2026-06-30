import express from "express";

import authMiddleware from "../middlewares/auth.js";
import { addToCart } from "../controllers/cartController.js";
import { getCart } from "../controllers/cartController.js";
import { updateCartItem } from "../controllers/cartController.js";
import { removeCartItem } from "../controllers/cartController.js";
import { clearUserCart } from "../controllers/cartController.js";


const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCart);
cartRouter.put("/update", authMiddleware, updateCartItem);
cartRouter.delete("/remove/:productId", authMiddleware, removeCartItem);
cartRouter.delete("/clear", authMiddleware, clearUserCart);

export default cartRouter;