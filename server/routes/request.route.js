import { Router } from "express";
import { approveDocument, createRequest, getAllRequests, rejectDocument } from "../controller/request.controller.js";
import { verifyToken } from "../middleware/middleware.js";
import { verifyAdminToken } from "../middleware/middleware.admin.js";

const requestRouter = Router();

requestRouter.get("/getallrequests", verifyAdminToken, getAllRequests);
requestRouter.post("/createrequest", verifyToken, createRequest);
requestRouter.put("/approvedoc", verifyAdminToken, approveDocument);
requestRouter.put("/rejectdoc", verifyAdminToken, rejectDocument);

export default requestRouter;