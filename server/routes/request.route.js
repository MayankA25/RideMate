import { Router } from "express";
import { approveDocument, createRequest, getAllRequests, rejectDocument } from "../controller/request.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const requestRouter = Router();

requestRouter.get("/getallrequests", getAllRequests);
requestRouter.post("/createrequest", createRequest);
requestRouter.put("/approvedoc", approveDocument);
requestRouter.put("/rejectdoc", rejectDocument);

export default requestRouter;