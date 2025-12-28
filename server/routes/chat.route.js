import { Router } from "express";
import { deleteMessage, getMessages, replyToMessage, sendMessage, updateMessage } from "../controller/chat.controller.js";
import { verifyToken } from "../middleware/middleware.js";



const chatRouter = Router();

chatRouter.get("/getmessages",verifyToken, getMessages);
chatRouter.post("/sendmessage",verifyToken, sendMessage);
chatRouter.put("/updatemessage",verifyToken, updateMessage);
chatRouter.delete('/deletemessage',verifyToken, deleteMessage);
chatRouter.post("/reply",verifyToken, replyToMessage);



export default chatRouter;