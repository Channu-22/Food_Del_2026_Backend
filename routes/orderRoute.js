import { placeOrder,verifyOrder, userOrders,listOrder,updateStatus } from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/auth.js";
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userOrders",authMiddleware,userOrders)
orderRouter.get("/list",listOrder)
orderRouter.post("/status",updateStatus)

export default orderRouter;


