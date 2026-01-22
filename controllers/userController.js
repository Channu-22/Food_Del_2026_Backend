import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import Validator from "validator"

function createToken(id) {
    return JWT.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

//login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate email
        if (!Validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // generate token
        const token = createToken(user._id);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token
        });

    } catch (err) {
        console.error("Failed to login:", err.message);
        return res.status(500).json({
            success: false,
            message: "Error while login"
        });
    }
};

// register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check existing user
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // validate email
        if (!Validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = createToken(newUser._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (err) {
        console.error("Register error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Error while registering user"
        });
    }
};
