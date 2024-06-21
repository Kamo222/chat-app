import express from "express";
import { createMessage, getMassages } from "../Controllers/messageController.js";

const messageRoute = express.Router();

messageRoute.post("/", createMessage);
messageRoute.get("/:chatId", getMassages);

export default messageRoute;

