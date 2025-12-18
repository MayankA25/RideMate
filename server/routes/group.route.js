import { Router } from "express";
import { getGroup } from "../controller/group.controller.js";

const groupRouter = Router();


groupRouter.get("/getgroup", getGroup);

export default groupRouter