import { Router } from "express";
import { getUsers } from "../controller/user.controller.js";
import { verifyAdminToken } from "../middleware/middleware.admin.js";

const userRouter = Router();

userRouter.get("/getusers", verifyAdminToken, getUsers)

export default userRouter;