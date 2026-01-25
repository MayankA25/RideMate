import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        required: true
    },
    role: [{ 
        type: String,
        enum: ["Passenger", "Passenger/Driver", "SuperAdmin"],
        required: true
    }],
    initialFormSubmitted: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String
    },
    driverLicense: {
        type: String
    },
    drivingLicenseStatus: {
        type: String,
        enums: ["not verified", "under review", "verified"],
        default: "not verified"
    },
    aadharCard: {
        type: String
    },
    aadharCardStatus: {
        type: String,
        enums: ["not verified", "under review", "verified"],
        default: "not verified"
    },
    passportSizePhoto: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    gender: {
        type: String,
        enums: ["Male", "Female", "Other"]
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);