import { Router } from "express";
import { addRideAlert, deleteRideAlert, getRideAlerts, getTrendingRides } from "../controller/rideAlert.controller.js";
import { verifyToken } from "../middleware/middleware.js";


const rideAlertRouter = Router();

rideAlertRouter.get("/getridealerts",verifyToken, getRideAlerts);
rideAlertRouter.get("/trendingrides",verifyToken, getTrendingRides);
rideAlertRouter.post("/addridealert",verifyToken, addRideAlert);
// rideAlertRouter.put("/updateridealert", updateRideAlert);
rideAlertRouter.delete("/deleteridealert",verifyToken, deleteRideAlert);

export default rideAlertRouter;