import { Router } from "express";
import { getUsers, removeUser, unbanUser } from "../controller/user.controller.js";
import { verifyAdminToken } from "../middleware/middleware.admin.js";

const userRouter = Router();

userRouter.get("/getusers", verifyAdminToken, getUsers);
userRouter.delete("/removeuser", verifyAdminToken, removeUser);
userRouter.put("/unbanuser", verifyAdminToken, unbanUser);

export default userRouter;