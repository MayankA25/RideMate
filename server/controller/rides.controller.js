import { Ride } from "../models/Rides.js";
import { getEstimatedTimeOfArrival } from "../utils/routing.js";
import { Group } from "../models/Group.js";
import { mailQueue } from "../utils/queue.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { RideAlert } from "../models/RideAlert.js";
import { io } from "../utils/socket.js";

export const getAllRides = async (req, res) => {
  const { pickup, destination, departureDate, seats } = req.query;
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
    console.log("Seats: ", seats);

    const rides = await Ride.find({
      "pickup.place_id": pickupJson.place_id,
      "destination.place_id": destinationJson.place_id,
      departureDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      driver: { $ne: req.session.passport.user.user._id },
      availableSeats: { $gte: seats },
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
      destinationCoords,
    );
    if (availableSeats <= 0 || fare < 0)
      return res
        .status(400)
        .json({ msg: "Error Occurred. Enter all the fields correcly." });
    const departureTimeInMilliSeconds = new Date(departureDate).getTime();
    const currentTimeInMilliSeconds = new Date().getTime();

    if (currentTimeInMilliSeconds >= departureTimeInMilliSeconds)
      return res.status(400).json({ msg: "Error Occurred" });

    const estimatedISOString = await getEstimatedTimeOfArrival(
      new Date(departureDate).toISOString(),
      pickupCoords,
      destinationCoords,
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

    const fullYear = new Date(departureDate).getFullYear();
    const month = new Date(departureDate).getMonth();
    const date = new Date(departureDate).getDate();

    console.log("FY: ", fullYear, " M: ", month, " D: ", date);

    const startDate = new Date(fullYear, month, date, 0, 0, 0, 0);
    const endDate = new Date(fullYear, month, date, 24, 0, 0, 0);

    const updatedRideAlerts = await RideAlert.updateMany(
      {
        "pickup.place_id": pickup.place_id,
        "destination.place_id": destination.place_id,
        departureDate: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
        numberOfPassengers: {
          $lte: availableSeats,
        },
      },
      {
        $addToSet: { rides: savedRide._id },
      },
    );

    console.log("Updated Ride Alerts: ", updatedRideAlerts);

    const rideAlertUsers = await RideAlert.find({
      "pickup.place_id": pickup.place_id,
      "destination.place_id": destination.place_id,
      departureDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      numberOfPassengers: {
        $lte: availableSeats,
      },
    })
      .populate("user")
      .select("user");

    console.log("Ride Alert Users: ", rideAlertUsers);

    const userEmails = rideAlertUsers.map((rideAlertObj) => {
      return rideAlertObj.user.email;
    });

    console.log("User Email: ", userEmails);

    await RideAlert.deleteMany(
      {
        "pickup.place_id": pickup.place_id,
        "destination.place_id": destination.place_id,
        departureDate: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        },
        numberOfPassengers: {
          $lte: availableSeats
        }
      }
    )

    const senderMail = req.session.passport.user.user.email;
    const accessToken = req.session.passport.user.accessToken;
    const refreshToken = req.session.passport.user.refreshToken;
    const cc = [];
    const bcc = [];

    const subject = `Ride Alert - ${pickup.address} to ${destination.address}`;

    const message = `<span style="font-weight:600">A new ride is available from <span style="font-weight-700">${pickup.address}</span> to <span style="font-weight: 700">${destination.address}</span> scheduled on <span style="font-weight:700">${new Date(departureDate).toDateString()}</span> with driver <span style="font-weight:700">${req.session.passport.user.user.firstName} ${req.session.passport.user.user.lastName} (${senderMail})</span>.
    <br></br>
    <br></br>
    Kindly go to the RideMate app for more information and booking ride.
    </span>`;

    userEmails.forEach(async (email, index) => {
      await mailQueue.add("mailQueue", {
        senderMail,
        recipient: email,
        accessToken,
        refreshToken,
        subject,
        message,
        cc,
        bcc,
        attachment: [],
      });
    });

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

  if (availableSeats <= 0 || fare < 0)
    return res
      .status(400)
      .json({ msg: "Error Occurred. Enter all the fields correcly." });

  const foundRide = await Ride.findById(rideId)
    .populate("driver")
    .populate("passengers")
    .populate("group");

  console.log("Pickup: ", pickupCoords, "Destination: ", destinationCoords);
  const date = new Date(departureDate).toISOString();
  const estimatedISOString = await getEstimatedTimeOfArrival(
    date,
    pickupCoords,
    destinationCoords,
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
      { new: true },
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
      { new: true },
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
      foundRide.departureDate,
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
    const deletedRide = await Ride.findByIdAndDelete(rideId)
      .populate("driver")
      .populate("passengers")
      .populate("group");
    console.log("Deleted Ride: ", deletedRide);
    const deletedGroup = await Group.findByIdAndDelete(deletedRide.group);
    console.log("Deleted Group: ", deletedGroup);

    const foundRides = await Ride.find({
      "pickup.place_id": deletedRide.pickup.place_id,
      "destination.place_id": deletedRide.destination.place_id,
      departureDate: new Date(deletedRide.departureDate),
      availableSeats: {
        $gte: deletedRide.availableSeats,
      },
    });
    const rideExists = foundRides.length > 0;
    const deletedRideAlerts = await RideAlert.updateMany(
      {
        "pickup.place_id": deletedRide.pickup.place_id,
        "destination.place_id": deletedRide.destination.place_id,
        departureDate: new Date(deletedRide.departureDate),
        numberOfPassengers: {
          $gte: deletedRide.availableSeats,
        },
      },

      {
        rideExists: rideExists,
      },
    );
    console.log("Deleted Ride Alerts: ", deletedRideAlerts);

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
    if (deletedRide.passengers.length > 0) {
      deletedRide.passengers.forEach(async (passenger, index) => {
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
  const { rideId } = req.body;

  try {
    const foundRide = await Ride.findById(rideId);

    const userId = req.session.passport.user.user._id;

    // if (foundRide.passengers.length >= foundRide.availableSeats) {
    //   return res.status(400).json({ msg: "Ride capacity is full" });
    // }

    // const updatedRide = await Ride.findByIdAndUpdate(
    //   rideId,
    //   { $addToSet: { passengers: userId } },
    //   { new: true }
    // )
    //   .populate("driver")
    //   .populate("passengers")
    //   .populate("group");

    const updatedRide = await Ride.findOneAndUpdate(
      {
        _id: rideId,

        // $expr ---> lets to calculate so here the first condition is of finding the document which is being finded by the rideId and also the ride which has passengers.length < availableSeats;
        $expr: {
          $lt: [{ $size: "$passengers" }, "$availableSeats"],
        },
      },
      {
        $addToSet: { passengers: userId },
        $set: { [`passengersJoinedAt.${userId}`]: new Date() },
      },
      { new: true },
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    if (!updatedRide) {
      return res.status(400).json({ msg: "Ride Capacity Is Full" });
    }
    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        $addToSet: { members: userId },
        $set: { [`membersJoinedAt.${userId}`]: new Date() },
      },
      { new: true },
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
        $unset: { [`passengersJoinedAt.${userId}`]: "" },
      },
      { new: true },
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    console.log("Updated Ride: ", updatedRide);
    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        $pull: { members: userId },
        $unset: { [`membersJoinedAt.${userId}`]: "" },
      },
      { new: true },
    );

    console.log("Updated Group: ", updatedGroup);

    // const groupMessages = await Message.find({
    //   $and: [
    //     { sender: userId },
    //     { group: updatedGroup._id }
    //   ]
    // });

    // groupMessages.forEach(async(message, index)=>{
    //   await Message.findByIdAndUpdate(message._id, {
    //     sender: [...Array(24)].map(()=>"d").join('')
    //   })
    //   const parentMessages = await Message.find({
    //     parentId: message._id
    //    });
    //    console.log("Parent Messages: ", parentMessages);
    //    parentMessages.forEach(async(pMessage, index)=>{
    //     await Message.findByIdAndUpdate(pMessage._id, {
    //       parentSenderName: [...Array(24)].map(()=>"d").join('')
    //     })
    //    })

    const parentIds = await Message.distinct("_id", {
      sender: userId,
      group: updatedGroup._id,
    });

    console.log("Parent Ids: ", parentIds);

    await Promise.all([
      // In the first condition i am find the documents using "$in" which checks whether document id is present in an array or not

      // In the second part i am updating sender
      Message.updateMany({ _id: { $in: parentIds } }, { sender: null }),

      // Now same in the first part i am filtering the messages which are present in the parentIds array and in second part i am updating the parentSenderName
      Message.updateMany(
        { parentId: { $in: parentIds } },
        { parentSenderName: null },
      ),
    ]);

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

export const getUserRides = async (req, res) => {
  const { userId } = req.query;
  try {
    const rides = await Ride.find({
      driver: userId,
    })
      .populate("driver")
      .populate("passengers")
      .populate("group");
    console.log("Rides: ", rides);

    return res.status(200).json({ rides: rides });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const removeRide = async (req, res) => {
  const { rideId } = req.query;

  try {
    const foundRide = await Ride.findById(rideId)
      .populate("driver")
      .populate("passengers")
      .populate("group");

    if (!foundRide) throw new Error("Ride Not Found");

    console.log("Found Ride: ", foundRide);

    await Message.deleteMany({ group: foundRide.group._id });
    console.log("Deleted Messages.");
    const deletedGroup = await Group.findByIdAndDelete(foundRide.group._id);
    console.log("Deleted Group: ", deletedGroup);

    const removedRide = await Ride.findByIdAndDelete(rideId)
      .populate("driver")
      .populate("passengers")
      .populate("group");
    console.log("Removed Ride: ", removedRide);

    // const groupMessages = await Message.find({ group: removedRide.group._id });

    // groupMessages.forEach(async(message, index)=>{
    //   await Message.findByIdAndDelete(message._id);
    // })

    const date = new Date(removedRide.departureDate);

    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0,
    );
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      24,
      0,
      0,
      0,
    );

    const foundRideAlertsIds = await RideAlert.distinct("_id", {
      "pickup.place_id": removedRide.pickup.place_id,
      "destination.place_id": removedRide.destination.place_id,
      departureDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      rides: rideId,
    });

    console.log("Found Ride Alerts: ", foundRideAlertsIds);

    const updatedRideAlerts = await RideAlert.updateMany(
      {
        _id: { $in: foundRideAlertsIds },
      },
      {
        $pull: {
          rides: rideId,
        },
      },
    );

    const senderMail = req.session.passport.user.user.email;
    const accessToken = req.session.passport.user.accessToken;
    const refreshToken = req.session.passport.user.refreshToken;
    const cc = [];
    const bcc = [];
    const subject = `Regarding your ride booking from ${removedRide.pickup.address} to ${removedRide.destination.address} scheduled on ${new Date(removedRide.departureDate).toDateString()} with driver ${removedRide.driver.firstName}(${removedRide.driver.email})`;
    const message = `<span style="font-weight:600">Your ride booking from <span style="font-weight:700">${removedRide.pickup.address}</span> to <span style="font-weight:700">${removedRide.destination.address}</span> scheduled on <span style="font-weight:700">${new Date(removedRide.departureDate).toDateString()}</span> which was assigned to ${removedRide.driver.firstName} ${removedRide.driver.lastName}(${removedRide.driver.email}), has been deleted by the ${foundRide.driver._id == req.session.passport.user.user._id ? "Driver" : "Admin"}(${senderMail}) and is no longer available on the RideMate.</span>.
    <br><br>
    <br></br>
    Kindly refer to other rides available on RideMate.
    <br><br>
    <br></br>
    Sorry for the inconvenience caused
    </span>`;
    const passengers = [...removedRide.passengers];
    if (foundRide.driver._id != req.session.passport.user.user._id)
      passengers.push(req.session.passport.user.user);
    if (passengers.length > 0) {
      passengers.forEach(async (passenger, index) => {
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

    return res.status(200).json({ msg: "Ride Removed Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const removePassenger = async (req, res) => {
  const { rideId, passengerId } = req.body;
  try {
    const foundRide = await Ride.findById(rideId);
    if (!foundRide) return res.status(400).json({ msg: "Ride Not Found" });

    // const deletedMessages = await Message.deleteMany(
    //   { group: foundRide.group }
    // );

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        $pull: { passengers: passengerId },
        $unset: { [`passengersJoinedAt.${passengerId}`]: "" },
      },
      { new: true },
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    console.log("Deleted Ride: ", updatedRide);

    const updatedGroup = await Group.findByIdAndUpdate(
      updatedRide.group._id,
      {
        $pull: { members: passengerId },
        $unset: { [`membersJoinedAt.${passengerId}`]: "" },
      },
      { new: true },
    ).populate("members");

    console.log("Updated Group: ", updatedGroup);

    const parentIds = await Message.distinct("_id", {
      sender: passengerId,
      group: foundRide.group,
    });

    console.log("Parent IDs: ", parentIds);

    await Promise.all([
      await Message.updateMany(
        {
          _id: { $in: parentIds },
        },
        {
          sender: null,
        },
      ),

      await Message.updateMany(
        {
          parentId: { $in: parentIds },
        },
        {
          parentSenderName: null,
        },
      ),
    ]);

    const isUserMember = await Group.exists({
      _id: updatedGroup._id,
      members: passengerId,
    });
    console.log("Is User Member: ", isUserMember);

    const foundUser = await User.findById(passengerId).select("email");

    const userId = req.session.passport.user.user._id;

    const senderMail = req.session.passport.user.user.email;
    const recipientMail = foundUser.email;
    const accessToken = req.session.passport.user.accessToken;
    const refreshToken = req.session.passport.user.refreshToken;
    const cc = [];
    const bcc = [];
    const subject = `Regarding your ride booking from ${updatedRide.pickup.address} to ${updatedRide.destination.address} scheduled on ${new Date(updatedRide.departureDate).toDateString()} with driver ${updatedRide.driver.firstName} (${updatedRide.driver.email})`;

    const message = `<span style="font-weight:600">Your ride booking from <span style="font-weight:700">${updatedRide.pickup.address}</span> to <span style="font-weight:700">${updatedRide.destination.address}</span> scheduled on <span style="font-weight:700">${new Date(updatedRide.departureDate).toDateString()}</span> which was assigned to<span style="font-weight:700">${updatedRide.driver.firstName} ${updatedRide.driver.lastName} (${updatedRide.driver.email})</span>. You have been removed from the booking by ${updatedRide.driver._id == userId ? `Driver (${senderMail})` : `Admin (${senderMail}) `}</span>.
    <br><br>
    <br></br>
    Kindly refer to other rides available on RideMate.
    <br><br>
    <br></br>
    Sorry for the inconvenience caused
    </span>`;

    await mailQueue.add("mailQueue", {
      senderMail: senderMail,
      recipient: recipientMail,
      accessToken: accessToken,
      refreshToken: refreshToken,
      subject: subject,
      message: message,
      cc: cc,
      bcc: bcc,
      attachment: {},
    });

    return res
      .status(200)
      .json({ msg: "Passenger Removed Successfully", ride: updatedRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const shareLiveCoordinates = async (req, res) => {
//   const { rideId, liveCoords } = req.body;
//   try {
//     const foundRide = await Ride.findById(rideId).populate('driver').populate('passengers').populate('group');
//     const userId = req.session.passport.user.user._id;

//     if(foundRide.driver._id != userId){
//       return res.status(400).json({ msg: "Only Driver Is Allowed To Share Live Location" })
//     }

//     if(!foundRide.isLiveTrackingEnabled){
//       return res.status(400).json({ msg: "Live Tracking of Ride has not been enabled by driver." })
//     }

//     console.log("Live Coords: ", liveCoords);

//     io.to(`map-${rideId}`).emit("liveCoords", liveCoords);

//     return res
//       .status(200)
//       .json({ msg: "Current Location Shared", liveCoords: liveCoords });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

export const shareLiveCoordinates = async(req, res)=>{
  const { liveCoords } = req.body;
  try{
    const userId = req.session.passport.user.user._id;
    const foundRides = await Ride.find({
      driver: userId,
      isLiveTrackingEnabled: true
    }).populate('driver').populate('passengers').populate('group');

    foundRides.forEach((ride, index)=>{
      io.to(`map-${ride._id}`).emit("liveCoords", liveCoords);
    });

    res.status(200).json({ msg: "Live Coords Shared", liveCoords: liveCoords });

  }catch(e){
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" })
  }
}

export const toggleLIveTracking = async (req, res) => {
  const { rideId } = req.body;
  try {
    const foundRide = await Ride.findById(rideId);
    if (!foundRide) return res.status(400).json({ msg: "Ride Not Found" });

    const isLiveTrackingEnabled = !foundRide.isLiveTrackingEnabled;

    // if(isLiveTrackingEnabled){

    //   const departureDate = foundRide.departureDate;

    //   if(new Date().getTime() < (new Date(departureDate).getTime() - 1 * 60 * 60 * 1000)){
    //     return res.status(400).json({ msg: "Live Tracking will be enabled 1 hour before Ride Time" })
    //   }

    // }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        isLiveTrackingEnabled: isLiveTrackingEnabled,
      },
      { new: true },
    )
      .populate("driver")
      .populate("passengers")
      .populate("group");

    console.log("Updated Ride: ", updatedRide);

    return res
      .status(200)
      .json({ msg: "Live Tracking Enabled", ride: updatedRide });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
