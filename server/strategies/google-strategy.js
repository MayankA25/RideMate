// import passport from "passport"; 
// import { Strategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import cloudinary from "../utils/cloudinary.js";
// import { User } from "../models/User.js";

import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/User.js";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })

// dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })

// const superAdmins = ['mayank.23bai10505@vitbhopal.ac.in'];

// passport.use(new Strategy({
//     clientID: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     callbackURL: "http://localhost:5000/api/auth/callback",
//     scope: ["email", "profile"],
//     accessType: "offline",
//     prompt: "consent",
//     approval_prompt: "force"
// }, async (accessToken, refreshToken, profile, done)=>{
//     // console.log("Access Token: ", accessToken);
//     // console.log("Refresh Token: ", refreshToken);
//     // console.log("Profile: ", profile);;

//     try{

//         const firstName = profile.name.givenName;
//         const lastName = profile.name.familyName;
//         const email = profile.emails[0].value;
//         const gmailPhoto = profile.photos[0].value;
//         console.log("First Name: ", firstName);
//         console.log("Last Name: ", lastName);
//         console.log("Email:", email);

//         const foundUser = await User.findOne({ email: email });

//         console.log("Found User: ", foundUser);

//         if(foundUser){
//             const userObj = { user: foundUser, accessToken: accessToken, refreshToken: refreshToken };
//             return done(null, {...userObj});
//         }

        
//         const profilePic = await cloudinary.uploader.upload(gmailPhoto, { public_id: `users/${profile.id}/profile` });
        
//         console.log("Profile Pic: ", profilePic.secure_url);
        
//         const role = superAdmins.includes(email) ? "superadmin" : "passenger";

//         const newUser = new User({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             profilePic: profilePic.secure_url,
//             role: role
//         })
        
//         const savedUser = await newUser.save();
        
//         const userObj = { user: savedUser, accessToken: accessToken, refreshToken: refreshToken };
        
//         return done(null, {...userObj});
//     }catch(e){
//         console.log(e);
//         return done(e, null);
//     }
// }))


// passport.serializeUser((user, done)=>{
//     console.log("User: ", user);
//     return done(null, user);
// })

// passport.deserializeUser(async(user, done)=>{
//     try{
//         console.log("User: ", user);
//         const email = user.user.email;
//         console.log("Email: ", email);
//         const foundUser = await User.findOne({ email: email });
//         if(!foundUser) throw new Error("Unauthenticated");
//         return done(null, user)
//     }catch(e){
//         return done(e, null)
//     }
// })

const superAdmins = ['mayank.23bai10505@vitbhopal.ac.in'];


passport.use(new Strategy(
    {
        clientID: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/callback",
        scope: ["profile", "email", "https://mail.google.com/"],
        accessType: "offline",
        prompt: "consent",
        approval_prompt: "force"
    },
    async(accessToken, refreshToken, profile, done)=>{
        console.log("Profile Obj: ", profile);

        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        let profilePic = profile.photos[0].value;
        const email = profile.emails[0].value;

        const foundUser = await User.findOne({ email: email });

        if(foundUser && foundUser.isBanned){
            return done("Your account has been banned. Contact admin of this app.", null)
        }
        
        if(foundUser){
            const userObj = { user: foundUser, accessToken: accessToken, refreshToken: refreshToken };
            return done(null, userObj);
        }

        console.log("First Name: ", firstName);
        console.log("Last Name: ", lastName);
        console.log("Profile Pic: ", profilePic);
        console.log("Email: ", email);

        const profilePicURL = await cloudinary.uploader.upload(profilePic, { public_id: `users/${profile.id}/profile` });

        console.log("Profile Pic URL: ", profilePicURL.secure_url);

        profilePic = profilePicURL.secure_url;

        const role = superAdmins.includes(email) ? "SuperAdmin" : "Passenger";
        const aadharCardStatus = superAdmins.includes(email) ? "verified" : "not verified";
        const drivingLicenseStatus = superAdmins.includes(email) ? "verified" : "not verified";

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            profilePic: profilePic,
            email: email,
            role: role,
            aadharCardStatus: aadharCardStatus,
            drivingLicenseStatus: drivingLicenseStatus
        });

        const savedUser = await newUser.save();

        console.log("Saved User: ", savedUser);

        const userObj = { user: savedUser, accessToken: accessToken, refreshToken: refreshToken };

        console.log("User Obj: ", userObj);

        return done(null, userObj);

    }
));

passport.serializeUser((userObj, done)=>{
    console.log("Serializing User: ", userObj);

    return done(null, userObj);
});

passport.deserializeUser(async (userObj, done)=>{
    const email = userObj.user.email;
    const foundUser = await User.findOne({ email });
    console.log("Deserializing Found User: ", foundUser);

    if(!foundUser) return done('Unauthenticated', foundUser);

    return done(null, userObj);
})