import Food from "../models/foodModel.js";
import fs from "fs"


//add food
export const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const image_uploaded = req.file;
        // console.log("imageUploaded:    ", image_uploaded)
        if (!name || !description || !price || !category || !image_uploaded) {
            return res.status(400).json({
                success: false,
                message: "All field are required"
            })
        };
        const foodDetail = await Food.create({
            name,
            description,
            price,
            image: image_uploaded.filename,
            category
        });

        res.status(201).json({
            success: true,
            message: "Food added",
            data: foodDetail,
        })

    } catch (err) {
        console.log("Error in creating a food", err.message);
        res.status(500).json({
            success: false,
            message: "Error in adding food",
        })

    }

}


//display all food item
export const listFood = async (req, res) => {
    try {
        const listAllFood = await Food.find({});

        return res.status(200).json({
            success: true,
            message: "All foodlist fetched successfully",
            data: listAllFood
        })

    } catch (err) {
        console.log("Failed to fetch all food", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch food list"
        })

    }
}

//remove food item


export const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required",
            });
        }

        const food = await Food.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found",
            });
        }

        // delete image from uploads folder
        const imagePath = `uploads/${food.image}`;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log("Image delete failed:", err.message);
            }
        });

        // delete food from DB
        await Food.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Food deleted successfully",
        });

    } catch (err) {
        console.log("Failed to remove food:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to remove food",
        });
    }
};
