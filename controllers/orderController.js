import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order from frontend
export const placeOrder = async (req, res) => {
  try {
    // const frontend_url = "https://food-del-channu22-frontend.vercel.app"
     const frontend_url = "https://food-del-channu-frontend.onrender.com"
    const newOrder = new Order({
      userId: req.user.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    })
    //saving order to db
    await newOrder.save();

    //cleaning user cart data
    await User.findByIdAndUpdate(req.user.userId, { cart: {} });

    //it is neccessary for stripe payment
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity

    }))

    //adding delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 2 * 100

      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

    })

    return res.status(201).json({
      success: true,
      message: "Order placed successfully. Redirecting to payment.",
      session_url: session.url
    })
  } catch (err) {
    console.error("Place order error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again.",

    })
  }

}

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    // payment successful
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({
        success: true,
        message: "Payment successful. Order has been confirmed.",
      });
    }

    // payment failed or cancelled
    else {
      await Order.findByIdAndDelete(orderId);
      return res.status(400).json({
        success: false,
        message: "Payment failed or cancelled. Order has been removed.",
      });
    }
  } catch (err) {
    console.error("Verify order error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error while verifying payment. Please try again.",
    });
  }
};

//user order for frontend 
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });

    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully.",
      data: orders,
    });

  } catch (err) {
    console.error("userOrders error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders. Please try again later.",
    });
  }
};


// Listing all orders for admin panel
export const listOrder = async (req, res) => {
  try {
    const orders = await Order.find({});

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });

  } catch (err) {
    console.error("listOrder error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// api for updating order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    // update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );


    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });

  } catch (err) {
    console.error("updateStatus error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

