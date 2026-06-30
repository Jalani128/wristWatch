import express from "express";
import { register, login, health } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/health", health);
userRouter.post("/login", login);

export default userRouter;