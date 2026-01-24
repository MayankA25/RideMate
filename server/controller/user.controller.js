import { Group } from "../models/Group.js";
import { Message } from "../models/Message.js";
import { RideAlert } from "../models/RideAlert.js";
import { Ride } from "../models/Rides.js";
import { User } from "../models/User.js";
import { mailQueue } from "../utils/queue.js";

export const getUsers = async (req, res) => {
  try {
    const userId = req.session.passport.user.user._id;
    const foundUsers = await User.find({
      _id: { $ne: userId },
    });
    console.log("Found Users: ", foundUsers);

    return res.status(200).json({ users: foundUsers });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const removeUser = async (req, res) => {
//   const { userId } = req.query;
//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);
//     const foundDriverRides = await Ride.find({ driver: deletedUser._id })
//       .populate("driver")
//       .populate("passengers")
//       .populate("group");

//     const senderMail = req.session.passport.user.user.email;
//     const accessToken = req.session.passport.user.accessToken;
//     const refreshToken = req.session.passport.user.refreshToken;
//     const cc = [];
//     const bcc = [];
//     const subject = `Regarding your ride booking from ${
//       removedRide.pickup.address
//     } to ${removedRide.destination.address} scheduled on ${new Date(
//       removedRide.departureDate
//     ).toDateString()}`;
//     const message = `<span style="font-weight:600">Your ride booking from <span style="font-weight:700">${
//       deletedRide.pickup.address
//     }</span> to <span style="font-weight:700">${
//       deletedRide.destination.address
//     }</span> scheduled on <span style="font-weight:700">${new Date(
//       removedRide.departureDate
//     ).toDateString()}</span> which was assigned to ${
//       removedRide.driver.firstName
//     } ${removedRide.driver.lastName}(${
//       removedRide.driver.email
//     }), has been deleted by the admin(${senderMail}) and is no longer available on the RideMate</span>.
//     <br><br>
//     <br></br>
//     Kindly refer to other rides available on RideMate.
//     <br><br>
//     <br></br>
//     Sorry for the inconvenience caused
//     </span>`;

//     foundDriverRides.forEach(async (ride, index) => {
//       await Ride.findByIdAndDelete(ride._id);
//       ride.passengers.forEach(async (passenger, index) => {
//         await mailQueue.add("mailQueue", {
//           senderMail,
//           recipient: passenger.email,
//           accessToken,
//           refreshToken,
//           subject,
//           message,
//           cc,
//           bcc,
//           attachment: [],
//         });
//       });
//       await Group.findByIdAndDelete(ride.group._id);

//       const groupMessages = await Message.find({ group: ride.group._id });

//       groupMessages.forEach(async (message, index)=>{
//         await Message.findByIdAndDelete(message._id);
//       })
//     });

//     const foundPassengerRides = await Ride.find({ passengers: userId })
//       .populate("driver")
//       .populate("passengers")
//       .populate("group");

//     foundPassengerRides.forEach(async (ride, index) => {
//       await Ride.findByIdAndUpdate(ride._id, {
//         $pull: { passengers: userId },
//       });
//       await Group.findByIdAndUpdate(ride.group._id, {
//         $pull: { members: userId },
//       });

//       const userSentMessages = await Message.find({
//         $and: [
//             { sender: userId },
//             { group: ride.group._id }
//         ]
//       });

//       userSentMessages.forEach(async(message, index)=>{
//         Message.findByIdAndUpdate(message._id, {
//             sender: [...Array(24)].map(()=>"d").join('')
//         })
//       })
//     });

//     return res.status(200).json({ msg: "User Deleted Successfully" });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// export const removeUser = async(req, res)=>{
//   const { userId } = req.query;
//   console.log("UserId: ", userId);
//   try{
//     const foundUser = await User.findById(userId);
//     if(!foundUser) throw new Error("User Not Found");

//     // Case-1: The User Is Driver

//     const groupIds = await Ride.distinct('group', {
//       driver: userId
//     });

//     console.log("Group Ids: ", groupIds);

//     await Promise.all([
//       Message.deleteMany({ group: { $in: groupIds } }),
//       Group.deleteMany({ _id: { $in: groupIds } }),
//       Ride.deleteMany({ sender: userId })
//     ])

//     // Case-2: The User is Passenger

//     const passengerGroupIds = await Ride.distinct('group', {
//       passengers: userId
//     })

//     console.log("Passenger Group Ids: ", passengerGroupIds);

//     await Promise.all([
//       Message.updateMany(
//         {
//           group: { $in: passengerGroupIds }
//         },
//         {
//           sender: null
//         }
//       ),
//       Group.updateMany(
//         {
//           _id: { $in: passengerGroupIds }
//         },
//         {
//           $pull: { members: userId },
//           $unset: { [`membersJoinedAt.${userId}`] : '' }
//         }
//       ),
//       Ride.updateMany(
//         {
//           group: { $in: passengerGroupIds }
//         },
//         {
//           $pull: { passengers: userId },
//           $unset: { [`passengersJoinedAt.${userId}`] : "" }
//         }
//       )
//     ]);

//     await User.findByIdAndDelete(userId);

//     console.log("Probably Deleted All Possible Data Related To User.");

//     return res.status(200).json({ msg: "User Removed Successfully." });

//   }catch(e){
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" })
//   }
// }

export const removeUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(400).json({ msg: "User Not Found" });

    // Case-1: The User is Driver

    const groupIds = await Ride.distinct("group", { driver: userId });

    await Promise.all([
      Group.deleteMany({
        _id: { $in: groupIds },
      }),
      Message.deleteMany({
        group: { $in: groupIds },
      }),
      Ride.deleteMany({
        driver: userId,
      }),
    ]);

    // Case-2: The User is Passenger;

    const passengerGroupIds = await Ride.distinct("group", {
      passengers: userId,
    });

    await Promise.all([
      Group.updateMany(
        { 
          _id: { 
            $in: passengerGroupIds 
          } 
        },
        {
          $pull: { members: userId },
          $unset: { [`membersJoinedAt.${userId}`] : "" }
        }
      ),

      Ride.updateMany(
        {
          group: { $in: passengerGroupIds }
        },
        {
          $pull: { passengers: userId },
          $unset: { [`passengersJoinedAt.${userId}`] : "" }
        }
      )
    ]);

    console.log("Phase1 completed");

    const parentIds = await Message.distinct("_id", { sender: userId });

    console.log("Parent Ids: ", parentIds);

    await Promise.all([
      Message.updateMany(
        { 
          _id: { $in: parentIds } 
        },
        {
          sender: null
        }
      ),

      Message.updateMany(
        { 
          parentId: { $in: parentIds } 
        },
        {
          parentSenderName: null
        }
      ),

      // Deleting The Ride Alerts created by the user

      RideAlert.deleteMany(
        {
          user: userId
        }
      )
    ]);

    await User.findByIdAndDelete(userId);
    
    console.log("Phase 2 completed")
    


    return res.status(200).json({ msg: "User Removed Successfully" })

  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
