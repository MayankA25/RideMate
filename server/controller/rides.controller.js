import { json } from "express";
import { Ride } from "../models/Rides.js";
import { getEstimatedTimeOfArrival } from "../utils/routing.js";
import { Group } from "../models/Group.js";

export const getAllRides = async (req, res) => {
  const { pickup, destination, departureDate } = req.query;
  const pickupJson = await JSON.parse(pickup);
  const destinationJson = await JSON.parse(destination);
  console.log("Pickup: ", pickupJson);
  console.log("Destination: ", destinationJson);
  console.log("Departure Date: ", departureDate);
  try {
    const rides = await Ride.find({
      "pickup.place_id": pickupJson.place_id,
      "destination.place_id": destinationJson.place_id,
    }).populate("driver");
    console.log("Rides: ", rides);

    const filterRides = rides.map((ride, index) => {
      if (
        ride.driver._id != req.session.passport.user.user._id &&
        new Date(departureDate).getTime() <=
          new Date(ride.departureDate).getTime() &&
        new Date(departureDate).getTime() + 24 * 60 * 60 * 60000 >
          new Date(ride.departureDate).getTime()
      ) {
        return ride;
      }
    });

    return res
      .status(200)
      .json({ msg: "All Available Rides", rides: filterRides });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getDriverRides = async (req, res) => {
  const { driverId } = req.query;
  try {
    const foundRides = await Ride.find({ driver: driverId }).populate("driver");
    console.log("Driver Rides: ", foundRides);

    return res.status(200).json({ rides: foundRides });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const addRide = async (req, res) => {
  const {
    driverId,
    pickup,
    destination,
    departureDate,
    fare,
    carName,
    carColor,
    availableSeats,
  } = req.body;
  try {
    const pickupCoords = [...pickup.coordinates].reverse();
    const destinationCoords = [...destination.coordinates].reverse();
    console.log(
      "Pickup: ",
      pickupCoords,
      "Destination Coords: ",
      destinationCoords
    );
    const estimatedISOString = await getEstimatedTimeOfArrival(
      new Date(departureDate).toISOString(),
      pickupCoords,
      destinationCoords
    );

    const groupName = `${pickup.address.split(",")[0]} to ${destination.address.split(",")[0]}`

    const newGroup = new Group({
      name: groupName,
      members: [driverId]
    });
    
    const savedGroup = await newGroup.save();


    const newRide = new Ride({
      driver: driverId,
      pickup: pickup,
      destination: destination,
      departureDate: new Date(departureDate).toISOString(),
      estimatedTimeOfArrival: estimatedISOString,
      fare: fare,
      carName: carName,
      carColor: carColor,
      availableSeats: availableSeats,
      group: savedGroup._id
    });


    const savedRide = await newRide.save();

    console.log("Saved Ride: ", savedRide);
    console.log("Saved Group: ", savedGroup);

    const foundRide = await Ride.findById(savedRide._id).populate("driver");
    return res
      .status(200)
      .json({ msg: "Ride Added Successfully", newRide: foundRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateRide = async (req, res) => {
  const { rideId, pickup, destination, departureDate, fare, availableSeats } =
    req.body;
  const pickupCoords = [...pickup.coordinates].reverse();
  const destinationCoords = [...destination.coordinates].reverse();

  console.log("Pickup: ", pickupCoords, "Destination: ", destinationCoords);
  const date = new Date(departureDate).toISOString();
  const estimatedISOString = await getEstimatedTimeOfArrival(
    date,
    pickupCoords,
    destinationCoords
  );
  console.log("ETA: ", estimatedISOString);
  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        pickup: pickup,
        destination: destination,
        departureDate: new Date(departureDate).toISOString(),
        estimatedTimeOfArrival: estimatedISOString,
        fare: fare,
        carName: carName,
        carColor: carColor,
        availableSeats: availableSeats,
      },
      { new: true }
    );
    console.log("Updated Ride: ", updatedRide);

    const newGroupName = `${ pickup.address.split(",")[0] } to ${ destination.address.split(",")[0] }`;

    return res
      .status(200)
      .json({ msg: "Ride Updated Successfully", updateRide: updateRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteRide = async (req, res) => {
  const { rideId } = req.query;
  try {
    const deletedRide = await Ride.findByIdAndDelete(rideId);
    console.log("Deleted Ride: ", deletedRide);
    return res.status(200).json({ msg: "Ride Deleted Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getRideInfo = async (req, res) => {
  const { rideId } = req.query;

  try {
    const foundRide = await Ride.findById(rideId).populate("driver").populate('passengers');
    console.log("Found Ride: ", foundRide);

    return res.status(200).json({ ride: foundRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const joinRide = async (req, res) => {
  const { rideId, userId } = req.body;

  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { $push: { passengers: userId } },
      { new: true }
    ).populate('passengers');

    console.log("Updated Ride: ", updatedRide);

    return res
      .status(200)
      .json({ msg: "Updated Ride Successfully", ride: updatedRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getBookedRides = async(req, res)=>{
  try{

    const rides = await Ride.find({}).populate('driver').populate('passengers');

    const filteredRides = rides.filter((ride, index)=>{
      let found = false;

      for(let i = 0; i<ride.passengers.length; i++){
        if(ride.passengers[i]._id == req.session.passport.user.user._id){
          found = true;
          break;
        }
      }

      if(found){
        return ride;
      }
    })

    console.log("Filtered Ride: ", filteredRides);

    return res.status(200).json({ rides: filteredRides });

  }catch(e){
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" })
  }
}
