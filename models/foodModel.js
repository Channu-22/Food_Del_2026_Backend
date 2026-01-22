import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String,
        required: true,
        trim: true

    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

export default mongoose.model("Food", foodSchema);