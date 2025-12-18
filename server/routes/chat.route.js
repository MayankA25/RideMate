import { Router } from "express";
import { getMessages } from "../controller/chat.controller.js";



const chatRouter = Router();

chatRouter.get("/getmessages", getMessages);



export default chatRouter;