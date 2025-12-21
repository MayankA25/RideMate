import { Router } from "express";
import { deleteMessage, getMessages, sendMessage, updateMessage } from "../controller/chat.controller.js";



const chatRouter = Router();

chatRouter.get("/getmessages", getMessages);
chatRouter.post("/sendmessage", sendMessage);
chatRouter.put("/updatemessage", updateMessage);
chatRouter.delete('/deletemessage', deleteMessage);



export default chatRouter;