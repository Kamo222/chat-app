import "./config.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute.js";
import chatRoute from "./Routes/chatRoute.js";
import messageRoute from "./Routes/messageRoute.js";

const app = express();

//Middleware
//Allows us to use JSON data
app.use(express.json());
//Allows us to  use cors
app.use(cors())

//Routing
app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

app.get("/", (request, response) => {
    response.send("Welcome to our chat app APIs")
})

//environment variables

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;

app.listen(PORT, (request, response) => {
    console.log(`Server runnnig on port ${PORT}`)
})

//Mongo Db connection

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Mongo Db connection established"))
.catch((error) => console.log("mongo Bd connection failed: ", error.message))
