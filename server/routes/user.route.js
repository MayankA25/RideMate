import { Router } from "express";
import { getUsers, removeUser } from "../controller/user.controller.js";
import { verifyAdminToken } from "../middleware/middleware.admin.js";

const userRouter = Router();

userRouter.get("/getusers", verifyAdminToken, getUsers);
userRouter.delete("/removeuser", verifyAdminToken, removeUser);

export default userRouter;