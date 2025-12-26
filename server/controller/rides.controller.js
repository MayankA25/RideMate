import { Ride } from "../models/Rides.js";
import { getEstimatedTimeOfArrival } from "../utils/routing.js";
import { Group } from "../models/Group.js";
import { mailQueue } from "../utils/queue.js";

export const getAllRides = async (req, res) => {
  const { pickup, destination, departureDate } = req.query;
  const pickupJson = await JSON.parse(pickup);
  const destinationJson = await JSON.parse(destination);
  console.log("Pickup: ", pickupJson);
  console.log("Destination: ", destinationJson);
  console.log("Departure Date: ", departureDate);
  try {
    console.log("User Departure Date: ", new Date(departureDate));

    // const utcNewDate = new Date(departureDate).getTime() + (timezoneOffsetInMinutes * 60 * 1000);

    // console.log("UTC New Date: ", utcNewDate);

    // const startDate = new Date(utcNewDate).getTime();
    // const ONE_DAY = 24 * 60 * 60 * 1000;
    // const endDate = new Date(utcNewDate).getTime() + ONE_DAY;

    const splittedDate = departureDate.split("-");

    const year = Number.parseInt(splittedDate[0]);
    const month = Number.parseInt(splittedDate[1]) - 1;
    const date = Number.parseInt(splittedDate[2]);

    console.log("Year: ", year, "Month: ", month, "Date: ", date);

    const startDate = new Date(year, month, date, 0, 0, 0, 0);
    const endDate = new Date(year, month, date, 24, 0, 0, 0);

    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);

    const rides = await Ride.find({
      "pickup.place_id": pickupJson.place_id,
      "destination.place_id": destinationJson.place_id,
      departureDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      driver: { $ne: req.session.passport.user.user._id },
    })
      .populate("driver")
      .populate("passengers")
      .populate("group");
    console.log("Rides: ", rides);

    return res.status(200).json({ msg: "All Available Rides", rides: rides });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getDriverRides = async (req, res) => {
  const { driverId } = req.query;
  try {
    const foundRides = await Ride.find({ driver: driverId })
      .populate("driver")
      .populate("passengers")
      .populate("group");
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
    const departureTimeInMilliSeconds = new Date(departureDate).getTime();
    const currentTimeInMilliSeconds = new Date().getTime();

    if (currentTimeInMilliSeconds >= departureTimeInMilliSeconds)
      return res.status(400).json({ msg: "Error Occurred" });

    const estimatedISOString = await getEstimatedTimeOfArrival(
      new Date(departureDate).toISOString(),
      pickupCoords,
      destinationCoords
    );

    const groupName = `${pickup.address.split(",")[0]} to ${
      destination.address.split(",")[0]
    }`;

    const newGroup = new Group({
      name: groupName,
      members: [driverId],
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
      group: savedGroup._id,
    });

    const savedRide = await newRide.save();

    console.log("Saved Ride: ", savedRide);
    console.log("Saved Group: ", savedGroup);

    const foundRide = await Ride.findById(savedRide._id)
      .populate("driver")
      .populate("group");
    return res
      .status(200)
      .json({ msg: "Ride Added Successfully", newRide: foundRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateRide = async (req, res) => {
  const {
    rideId,
    pickup,
    destination,
    departureDate,
    fare,
    carName,
    carColor,
    availableSeats,
  } = req.body;
  const pickupCoords = [...pickup.coordinates].reverse();
  const destinationCoords = [...destination.coordinates].reverse();

  const foundRide = await Ride.findById(rideId)
    .populate("driver")
    .populate("passengers")
    .populate("group");

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
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");
    console.log("Updated Ride: ", updatedRide);

    const newGroupName = `${pickup.address.split(",")[0]} to ${
      destination.address.split(",")[0]
    }`;

    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        name: newGroupName,
      },
      { new: true }
    );

    const senderMail = req.session.passport.user.user.email;
    const accessToken = req.session.passport.user.accessToken;
    const refreshToken = req.session.passport.user.refreshToken;
    const cc = [];
    const bcc = [];
    console.log("Updated Group: ", updatedGroup);

    const subject = `Regarding your ride booking from ${
      foundRide.pickup.address
    } to ${foundRide.destination.address} on ${new Date(
      foundRide.departureDate
    ).toDateString()}`;

    // const message = `Your ride booking from ${foundRide.pickup.address} to ${
    //   foundRide.destination.address
    // } on ${new Date(
    //   foundRide.departureDate
    // ).toDateString()} which is assigned to me, has now been updated to the ride from ${
    //   updatedRide.pickup.address
    // } to ${updatedRide.destination.address} scheduled on ${new Date(
    //   updatedRide.departureDate
    // ).toDateString()}.<br></br><br>>/br>Sorry for the inconvenience caused`;

    const message = `<span style="font-weight:600">Your ride booking from <span style="font-weight:700">${foundRide.pickup.address}</span> to <span style="font-weight:700">${foundRide.destination.address}</span> on <span style="font-weight:700">${new Date(foundRide.departureDate).toDateString()}</span> which is assigned to me, has now been updated to the ride from <span style="font-weight:700">${updatedRide.pickup.address}</span> to <span style="font-weight:700">${updatedRide.destination.address}</span> scheduled on <span style="font-weight:700">${new Date(updatedRide.departureDate).toDateString()}</span>.
    <br><br>
    <br></br>
    Sorry for the inconvenience caused
    </span>`;

    if (updatedRide.passengers.length > 0) {
      updatedRide.passengers.forEach(async (passenger, index) => {
        await mailQueue.add("mailQueue", {
          senderMail,
          recipient: passenger.email,
          accessToken,
          refreshToken,
          subject,
          message,
          cc,
          bcc,
          attachment: [],
        });
      });
    }

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
    const deletedRide = await Ride.findByIdAndDelete(rideId).populate('driver').populate('passengers').populate('group');
    console.log("Deleted Ride: ", deletedRide);
    const deletedGroup = await Group.findByIdAndDelete(deletedRide.group);
    console.log("Deleted Group: ", deletedGroup);
    const senderMail = req.session.passport.user.user.email;
    const accessToken = req.session.passport.user.accessToken;
    const refreshToken = req.session.passport.user.refreshToken;
    const cc = [];
    const bcc = [];
    const subject = `Regarding your ride booking from ${deletedRide.pickup.address} to ${deletedRide.destination.address} scheduled on ${new Date(deletedRide.departureDate).toDateString()}`;
    const message = `<span style="font-weight:600">Your ride booking from <span style="font-weight:700">${deletedRide.pickup.address}</span> to <span style="font-weight:700">${deletedRide.destination.address}</span> scheduled on <span style="font-weight:700">${new Date(deletedRide.departureDate).toDateString()}</span> which was assigned to me, has been deleted and is no longer available on the RideMate</span>.
    <br><br>
    <br></br>
    Kindly refer to other rides available on RideMate.
    <br><br>
    <br></br>
    Sorry for the inconvenience caused
    </span>`;
    if(deletedRide.passengers.length > 0){
      deletedRide.passengers.forEach(async(passenger, index)=>{
        await mailQueue.add('mailQueue', {
          senderMail,
          recipient: passenger.email,
          accessToken,
          refreshToken,
          subject,
          message,
          cc,
          bcc,
          attachment: []
        })
      })
    }
    return res.status(200).json({ msg: "Ride Deleted Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getRideInfo = async (req, res) => {
  const { rideId } = req.query;

  try {
    const foundRide = await Ride.findById(rideId)
      .populate("driver")
      .populate("passengers");
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
    const foundRide = await Ride.findById(rideId);

    if (foundRide.passengers.length >= foundRide.availableSeats) {
      return res.status(400).json({ msg: "Ride capacity is full" });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { $push: { passengers: userId } },
      { new: true }
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        $push: { members: userId },
      },
      { new: true }
    );

    console.log("Updated Ride: ", updatedRide);
    console.log("Updated Group: ", updatedGroup);

    return res
      .status(200)
      .json({ msg: "Updated Ride Successfully", ride: updatedRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const cancelRide = async (req, res) => {
  const { rideId } = await req.body;
  try {
    const userId = req.session.passport.user.user._id;
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        $pull: { passengers: userId },
      },
      { new: true }
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    console.log("Updated Ride: ", updatedRide);
    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        $pull: { members: userId },
      },
      { new: true }
    );

    console.log("Updated Group: ", updatedGroup);

    return res
      .status(200)
      .json({ msg: "Ride cancelled successfully", ride: updatedRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getBookedRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      passengers: req.session.passport.user.user._id,
    })
      .populate("driver")
      .populate("passengers")
      .populate("group");

    // const filteredRides = rides.filter((ride, index) => {
    //   let found = false;

    //   for (let i = 0; i < ride.passengers.length; i++) {
    //     if (ride.passengers[i]._id == req.session.passport.user.user._id) {
    //       found = true;
    //       break;
    //     }
    //   }

    //   if (found) {
    //     return ride;
    //   }
    // });

    console.log("Filtered Ride: ", rides);

    return res.status(200).json({ rides: rides });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
