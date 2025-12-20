import { Router } from "express";
import { getMessages, sendMessage } from "../controller/chat.controller.js";



const chatRouter = Router();

chatRouter.get("/getmessages", getMessages);
chatRouter.post("/sendmessage", sendMessage);



export default chatRouter;