import { Router } from "express";
import { verifyToken } from "../middleware/middleware.js";
import { addReport, deleteReport, getAllReports } from "../controller/reports.controller.js";


const reportRouter = Router();

reportRouter.get("/getreports", verifyToken, getAllReports);
reportRouter.post("/submitreport", verifyToken, addReport);
reportRouter.delete("/deletereport", verifyToken, deleteReport);

export default reportRouter;