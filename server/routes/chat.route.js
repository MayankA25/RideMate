import { Router } from "express";
import { deleteMessage, getMessages, replyToMessage, sendMessage, updateMessage } from "../controller/chat.controller.js";



const chatRouter = Router();

chatRouter.get("/getmessages", getMessages);
chatRouter.post("/sendmessage", sendMessage);
chatRouter.put("/updatemessage", updateMessage);
chatRouter.delete('/deletemessage', deleteMessage);
chatRouter.post("/reply", replyToMessage);



export default chatRouter;