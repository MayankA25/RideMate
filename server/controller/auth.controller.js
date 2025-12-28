import { Request } from "../models/Requests.js";
import { Ride } from "../models/Rides.js";
import { User } from "../models/User.js";
import { validatePhone } from "../utils/phone.js";

// export const callback = async(req, res)=>{
//     console.log("Session: ", req.session.passport.user.user);
//     // return res.status(200).json({ msg: "Logged in successfully", user: req.session.passport.user.user });
//     return res.redirect("http://localhost:5173/");
// }

export const callback = async (req, res) => {
  console.log("Session: ", req.session);
  // return res.status(200).json({ msg: "Callback URL" });
  return res.redirect("http://localhost:5173/");
};

// export const getUser = async(req, res)=>{
//     try{
//         console.log("Get User Session: ", req.session)

//         console.log("User: ", req.user);

//         if(!req.session.passport) return res.status(401).json({ msg: "Unauthenticated" })

//         const email = req.session.passport.user.user.email;
//         const foundUser = await User.findOne({ email: email });

//         if(!foundUser) return res.status(401).json({ msg: "Unaithenticated" });

//         return res.status(200).json({ user: req.session.passport.user.user });
//     }catch(e){
//         console.log(e);
//         return res.status(500).json({ msg: "Internal Server Error" })
//     }
// }

export const getUser = async (req, res) => {
  try {
    console.log("Session: ", req.session);

    if (!req.session.passport) {
      return res.status(401).json({ msg: "Unauthenticated" });
    }
    const user = req.session?.passport?.user?.user;
    return res.status(200).json({ user: user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const submitForm = async (req, res) => {
  const { id, phone, country, state, profilePic, gender } = req.body;
  try {
    const validPhone = validatePhone(phone);
    if (!validPhone)
      return res.status(400).json({ msg: "Invalid Phone Number" });
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        phone: phone,
        country: country,
        state: state,
        profilePic: profilePic,
        initialFormSubmitted: true,
        gender: gender,
      },
      { new: true }
    );
    req.session.passport.user.user = {
      ...req.session.passport.user.user,
      initialFormSubmitted: true,
      phone: phone,
      country: country,
      state: state,
      profilePic: profilePic,
      gender: gender,
    };
    console.log("Updated User: ", updatedUser);

    return res.status(200).json({ updatedUser: updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const submitDocument = async (req, res) => {
  const { id } = req.body;

  try {
    const foundUser = await User.findById(id);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        aadharCard: req.body?.aadharCard
          ? req.body.aadharCard
          : foundUser.aadharCard,
        aadharCardStatus: req.body?.aadharCard
          ? "under review"
          : foundUser.aadharCardStatus,
        driverLicense: req.body?.drivingLicense
          ? req.body.drivingLicense
          : foundUser.driverLicense,
        drivingLicenseStatus: req.body?.drivingLicense
          ? "under review"
          : foundUser.drivingLicenseStatus,
      },
      { new: true }
    );

    console.log("Updated User: ", updatedUser);

    req.session.passport.user.user = {
      ...req.session.passport.user.user,
      aadharCard: req.body?.aadharCard
        ? req.body.aadharCard
        : foundUser.aadharCard,
      aadharCardStatus: req.body?.aadharCard
        ? "under review"
        : foundUser.aadharCardStatus,
      driverLicense: req.body?.drivingLicense
        ? req.body.drivingLicense
        : foundUser.driverLicense,
      drivingLicenseStatus: req.body?.drivingLicense
        ? "under review"
        : foundUser.drivingLicenseStatus,
    };

    const documents = [];

    if (req.body.aadharCard) {
      documents.push({ aadharCard: req.body.aadharCard });
    }
    if (req.body.drivingLicense) {
      documents.push({ drivingLicense: req.body.drivingLicense });
    }

    const foundRequest = await Request.findOne({ userId: id });

    console.log("Documents: ", documents);

    if (foundRequest) {
      const updatedRequest = await Request.findByIdAndUpdate(
        foundRequest._id,
        {
          documents: [...foundRequest.documents, ...documents],
        },
        { new: true }
      );
      console.log("Updated Request: ", updatedRequest);
      return res
        .status(200)
        .json({ msg: "Document Uploaded", updatedUser: updatedUser });
    }

    const newRequest = new Request({
      userId: id,
      documents: documents,
    });

    await newRequest.save();

    return res
      .status(200)
      .json({ msg: "Document Uploaded", updatedUser: updatedUser });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  const { userId, profilePic } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: profilePic,
      },
      { new: true }
    );
    console.log("Updated User: ", updatedUser);
    return res
      .status(200)
      .json({ msg: "Profile Picture Updated", updatedUser: updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const logout = async(req, res)=>{
//     try{
//         console.log("LogOut Session: ", req.session);
//             req.session.destroy();
//             delete req.user;
//             res.clearCookie('connect.sid');
//         return res.status(200).json({ msg: "Logged Out Successfully", authenticated: false });
//     }catch(e){
//         console.log(e);
//         return res.status(500).json({ msg: "Internal Server Error" })
//     }
// }

export const getSpecificUser = async (req, res) => {
  const { id } = req.query;

  try {
    console.log("ID: ", id);
    const foundUser = await User.findById(id);

    if (!foundUser) return res.status(404).json({ msg: "User Not Found" });

    const accessingUserId = req.session.passport?.user?.user?._id;
    let specificUser = { ...foundUser._doc };

    // Checking If accessing user shares any ride with the specific user needed

    const foundRide1 = await Ride.find({
      passengers: { $all: [accessingUserId, id] }
    })

    console.log("Found Ride 1 : ", foundRide1);

    const foundRide2 = await Ride.find({
      $or: [
        {
          $and: [
            { passengers: accessingUserId },
            { driver: id }
          ]
        },
        {
          $and: [
            { driver: accessingUserId },
            { passengers: id }
          ]
        }
      ]
    });

    console.log("Found Ride 2: ", foundRide2);

    const user = req.session.passport.user.user;

    const isUserSuperAdmin = user.role.includes("SuperAdmin");


    if (!isUserSuperAdmin && (!accessingUserId || (accessingUserId != id && (foundRide1.length == 0 && foundRide2.length == 0)))) {
      specificUser = {
        ...specificUser,
        phone: `${specificUser.phone.slice(0, 4)}${[...Array(6)].map(
          () => "*"
        ).join("")}${specificUser.phone.slice(
          specificUser.phone.length - 2,
          specificUser.phone.length
        )}`,
        email: `${specificUser.email.charAt(0)}${[...Array(10)].map(()=>"*").join("")}@${specificUser.email.split("@")[1]}`
      };
    }

    console.log("Specific User: ", specificUser);

    console.log("Specific User: ", specificUser);

    return res.status(200).json({ user: specificUser });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ msg: "Not Found" });
  }
};

export const logout = async (req, res) => {
  if (req.session) {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid", { path: "/" });
        res.status(200).json({ msg: "Logged Out Successfully" });
      });
    });
  }
};
