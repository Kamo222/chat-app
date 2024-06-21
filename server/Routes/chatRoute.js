import express from "express";
import { createChat, findChat, findUserChats } from "../Controllers/chatController.js";

const chatRoute = express.Router();

chatRoute.post("/", createChat);
chatRoute.get("/:userId", findUserChats);
chatRoute.get("/find/:firstID/:secondId", findChat);

export default chatRoute;



