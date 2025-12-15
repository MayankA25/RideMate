import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    transports: ["websocket"],
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    },
    withCredentials: true
})


const userSocketMap = {};

export const getReceiverSocketId = (userId)=>{
    console.log("Socket ID: ", userSocketMap[userId])
    return userSocketMap[userId]
}

io.on("connection", (socket)=>{
    console.log("Am User Connected: ", socket.id);
    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id
    };

    console.log("User Socket Map: ", userSocketMap);

    socket.on("disconnect", ()=>{
        delete userSocketMap[userId];
        console.log("An User Disconnected: ", socket.id)
    });

    socket.on("join-room", ()=>{
        
    })
})


export { io, app, server }