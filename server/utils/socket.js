import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Ride } from "../models/Rides.js";

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
        socket.userId = userId;
    };

    console.log("User Socket Map: ", userSocketMap);

    socket.on("disconnect", ()=>{
        delete userSocketMap[userId];
        console.log("An User Disconnected: ", socket.id)
    });

    socket.on("join-room", async ({ rideId })=>{

        console.log("Joining Room....");

        // Authorization

        const foundRide = await Ride.findOne({
            _id: rideId,
            $or: [
                { driver: socket.userId },
                { passengers: socket.userId }
            ]
        });

        if(!foundRide){
            console.log("Ride Not Found");
            return;
        }

        socket.join(rideId);

        console.log(`${socket.userId} joined room for ride id: ${rideId}`);
    });

    socket.on("leave-room", async({ rideId })=>{
        console.log("Leaving Room...");
        socket.leave(rideId);
        console.log(`${ socket.userId } left the room for ride id: ${ rideId }`)
    })
})


export { io, app, server }