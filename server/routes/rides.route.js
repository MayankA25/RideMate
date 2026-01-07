import { Router } from "express";
import { addRide, cancelRide, deleteRide, getAllRides, getBookedRides, getDriverRides, getRideInfo, getUserRides, joinRide, removePassenger, removeRide, updateRide } from "../controller/rides.controller.js";
import { verifyAdminToken } from "../middleware/middleware.admin.js";
import { verifyToken } from "../middleware/middleware.js";

const rideRouter = Router();

rideRouter.get("/getrides",verifyToken, getAllRides);
rideRouter.get("/getdriverrides",verifyToken, getDriverRides);
rideRouter.post("/addride",verifyToken, addRide);
rideRouter.put("/updateride",verifyToken, updateRide)
rideRouter.delete("/deleteride",verifyToken, deleteRide);
rideRouter.get("/getrideinfo", getRideInfo);
rideRouter.post("/joinride",verifyToken, joinRide);
rideRouter.post("/cancelride",verifyToken, cancelRide);
rideRouter.get("/getbookedrides", verifyToken, getBookedRides);
rideRouter.get("/getuserrides", verifyAdminToken, getUserRides)
rideRouter.delete("/removeride", verifyAdminToken, removeRide);
rideRouter.post("/removepassenger", verifyToken, removePassenger);

export default rideRouter;