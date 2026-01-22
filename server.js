import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/database.js";
import foodRoute from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import path from "path";
import cartRoute from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
//app config and dotenv
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173", // or whatever port your frontend runs on
//   credentials: true
// }));

app.get("/", (req, res) => {
    res.send("API WORKING")

})

// api endpoint
// app.use("/images",express.static("uploads"));
app.use(
  "/images",
  express.static(path.resolve("uploads"))
);
app.use("/api/food",foodRoute)
app.use("/api/user",userRouter)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRouter)


//dbConnection + server
const server = async () => {
    try {
        await dbConnection();
        app.listen(PORT, () => {
            console.log(`server running at http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error("error iin dbConnection: ", err.message);
        process.exit(1);
    }
}
server();



