import express from "express";
import session from "express-session";
import Mongo from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "../routes/auth.route.js";
import cors from "cors";
import { app, server } from "../utils/socket.js";
import cookieParser from "cookie-parser";
import fileRouter from "../routes/files.route.js";
import requestRouter from "../routes/request.route.js";
import passport from "passport";
import rideRouter from "../routes/rides.route.js";
import suggestionRouter from "../routes/suggestion.route.js";
import chatRouter from "../routes/chat.route.js";
import groupRouter from "../routes/group.route.js";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected To Mongo DB.")
}).catch((e)=>{
    console.log("Error While Connecting To DB ", e);
})



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60000,
        secure: false,
        httpOnly: true,
    },
    store: Mongo.create({
        client: mongoose.connection.getClient()
    })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

app.use((req, res, next)=>{
    res.set('Cache-Control', 'no-store');
    next();
})

app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);
app.use("/api/requests", requestRouter);
app.use("/api/rides", rideRouter);
app.use("/api/suggestions", suggestionRouter);
app.use("/api/group", groupRouter);
app.use("/api/chat", chatRouter);
app.use("/api/users")

const PORT = process.env.PORT;
server.listen(PORT, ()=>{
    console.log(`Listening On The Port: ${PORT}`);
});