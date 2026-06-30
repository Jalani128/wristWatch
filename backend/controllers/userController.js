import mongoose from "mongoose";
import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const TOKEN_EXPIRE_IN = '24h';
const JWT_SECRET_KEY = 'secretkey';


// register of a user
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            })
        }
        const exists = await User.findOne({ email }).lean();
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword,
        })
        await user.save();

        if (!JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is not defined");
        const token = jwt.sign({
            id: newId.toString()
        },
            JWT_SECRET_KEY, {
            expiresIn: TOKEN_EXPIRE_IN,
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            }
        })

    } catch (err) {
        console.error("Error in register controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export async function health(req, res) {
    res.send('Hello World!');
}

// to login as a user
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            JWT_SECRET_KEY,
            { expiresIn: TOKEN_EXPIRE_IN }
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            }
        });

    } catch (err) {
        console.error("Error in login controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
