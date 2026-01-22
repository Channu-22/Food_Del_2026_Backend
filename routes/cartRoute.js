import express, { Router } from "express";
import { addtoCart,removeFromCart,getCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";

const cartRoute = express.Router();

cartRoute.post("/add",authMiddleware,addtoCart);
cartRoute.post("/remove",authMiddleware,removeFromCart);
cartRoute.post("/get",authMiddleware,getCart);

export default cartRoute;