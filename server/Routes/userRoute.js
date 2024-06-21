import express from "express";
import { loginUser, registerUser, findUser, getUsers } from "../Controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser)
userRoute.post("/login", loginUser)
userRoute.get("/find/:userId", findUser)
userRoute.get("/", getUsers)

export default userRoute;