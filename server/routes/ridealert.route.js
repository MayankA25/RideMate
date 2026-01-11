import { Router } from "express";
import { addRideAlert, deleteRideAlert, getRideAlerts, updateRideAlert } from "../controller/rideAlert.controller.js";


const rideAlertRouter = Router();

rideAlertRouter.get("/getridealerts", getRideAlerts);
rideAlertRouter.post("/addridealert", addRideAlert);
rideAlertRouter.put("/updateridealert", updateRideAlert);
rideAlertRouter.delete("/deleteridealert", deleteRideAlert);

export default rideAlertRouter;