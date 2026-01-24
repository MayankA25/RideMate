import { RideAlert } from "../models/RideAlert.js";
import { Ride } from "../models/Rides.js";

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
    const { pickup, destination, departureDate, numberOfPassengers, createAnyway } = req.body;
    try{
        const userId = req.session.passport.user.user._id;

        const pickupJson = await JSON.parse(pickup);
        const destinationJson = await JSON.parse(destination);

        const splittedDate = departureDate.split("-");

        const year = Number.parseInt(splittedDate[0]);
        const month = Number.parseInt(splittedDate[1]) - 1;
        const date = Number.parseInt(splittedDate[2]);

        const startDate = new Date(year, month, date, 0 ,0 ,0 , 0);
        const endDate = new Date(year, month, date, 24, 0, 0, 0);

        const foundRideAlerts = await RideAlert.find({
            user: userId,
            "pickup.place_id" : pickupJson.place_id,
            "destination.place_id" : destinationJson.place_id,
            departureDate: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            },
            numberOfPassengers: {
                $gte: numberOfPassengers
            }
        });

        if(foundRideAlerts.length > 0){
            return res.status(200).json({ msg: "Ride Alert Already Exists", rideAlertAlreadyExists: true });
        }

        const foundRides = await Ride.find({
            driver: {
                $ne: userId
            },
            'pickup.place_id' : pickupJson.place_id,
            'destination.place_id' : destinationJson.place_id,
            departureDate: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            },
            availableSeats: {
                $gte: numberOfPassengers
            }
        });

        if(foundRides.length > 0 && !createAnyway){
            return res.status(200).json({ msg: "Match Found", matchFound: true });
        }

        
        const newRide = new RideAlert({
            user: userId,
            pickup: pickupJson,
            destination: destinationJson,
            departureDate: new Date(departureDate),
            numberOfPassengers: numberOfPassengers
        });

        const savedRideAlert = await (await newRide.save()).populate('user');

        console.log("Saved Ride Alert: ", savedRideAlert);

        return res.status(200).json({ msg: "Added Ride Alert", rideAlert: savedRideAlert, matchFound: false });

    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

// export const updateRideAlert = async(req, res)=>{
//     const { rideAlertId, pickup, destination, departureDate } = req.body;
//     try{
//         const updatedRideAlert = await RideAlert.findByIdAndUpdate(rideAlertId, {
//             pickup: pickup,
//             destination: destination,
//             departureDate: new Date(departureDate)
//         }).populate('user');
//         console.log("Updated Ride Alert: ", updateRideAlert);

//         return res.status(200).json({ msg: "Updated Ride Alert Successfully", updatedRideAlert: updatedRideAlert })
//     }catch(e){
//         console.log(e);
//         return res.status(500).json({ msg: "Internal Server Error" })
//     }
// }


export const deleteRideAlert = async(req, res)=>{
    const { rideAlertId } = req.query;
    try{
        const deletedRideAlert = await RideAlert.findByIdAndDelete(rideAlertId).populate('user');
        console.log("Deleted Ride: ", deletedRideAlert);

        return res.status(200).json({ msg: "Deleted Ride Alert Successfully" });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}