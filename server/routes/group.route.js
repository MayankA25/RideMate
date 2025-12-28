import { Router } from "express";
import { getGroup } from "../controller/group.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const groupRouter = Router();


groupRouter.get("/getgroup", verifyToken, getGroup);

export default groupRouter