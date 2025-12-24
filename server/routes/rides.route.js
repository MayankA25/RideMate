import { Router } from "express";
import { addRide, cancelRide, deleteRide, getAllRides, getBookedRides, getDriverRides, getRideInfo, joinRide, updateRide } from "../controller/rides.controller.js";

const rideRouter = Router();

rideRouter.get("/getrides", getAllRides);
rideRouter.get("/getdriverrides", getDriverRides);
rideRouter.post("/addride", addRide);
rideRouter.put("/updateride", updateRide)
rideRouter.delete("/deleteride", deleteRide);
rideRouter.get("/getrideinfo", getRideInfo);
rideRouter.post("/joinride", joinRide);
rideRouter.post("/cancelride", cancelRide);
rideRouter.get("/getbookedrides", getBookedRides);


export default rideRouter