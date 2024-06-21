import { Server } from "socket.io";

const io = new Server({ cors: "http://localhost:5173/"});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  //Listen for an event from the client side
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&

    onlineUsers.push({
        userId,
        socketId: socket.id
    })

    io.emit("getOnlineUsers", onlineUsers);
  })

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId !== message.recipientId);
    console.log("user",user);
    console.log(message);

    if(user){
        io.to(user.socketId).emit("getMessage", message);
        console.log("user socketId",user.socketId);
    }
  })

  console.log(onlineUsers)
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  })

  
});

io.listen(3000);
console.log("Running on port 3000");