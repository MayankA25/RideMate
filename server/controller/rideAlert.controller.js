import { RideAlert } from "../models/RideAlert.js";

export const getRideAlerts = async(req, res)=>{
    try{
        const userId = req.session.passport.user.user._id;
        const rideAlerts = await RideAlert.find({
            user: userId
        });
        console.log("RIde Alerts: ", rideAlerts);
        
        return res.status(200).json({ rideAlerts: rideAlerts });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const addRideAlert = async(req, res)=>{
    const { pickup, destination, departureDate, numberOfPassengers } = req.body;
    try{
        const userId = req.session.passport.user.user._id;
        const newRide = new RideAlert({
            user: userId,
            pickup: pickup,
            destination: destination,
            departureDate: new Date(departureDate),
            numberOfPassengers: numberOfPassengers
        });

        const savedRideAlert = await (await newRide.save()).populate('user');

        console.log("Saved Ride Alert: ", savedRideAlert);

        return res.status(200).json({ msg: "Added Ride Alert", rideAlert: savedRideAlert });

    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const updateRideAlert = async(req, res)=>{
    const { rideAlertId, pickup, destination, departureDate } = req.body;
    try{
        const updatedRideAlert = await RideAlert.findByIdAndUpdate(rideAlertId, {
            pickup: pickup,
            destination: destination,
            departureDate: new Date(departureDate)
        }).populate('user');
        console.log("Updated Ride Alert: ", updateRideAlert);

        return res.status(200).json({ msg: "Updated Ride Alert Successfully", updatedRideAlert: updatedRideAlert })
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const deleteRideAlert = async(req, res)=>{
    const { rideAlertId } = req.query;
    try{
        const deletedRide = await RideAlert.findByIdAndDelete(rideAlertId).populate('user');
        console.log("Deleted Ride: ", deleteRideAlert);

        return res.status(200).json({ msg: "Deleted Ride Alert Successfully" });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}