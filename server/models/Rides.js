import mongoose, { mongo, Schema } from "mongoose";


const rideSchema = new Schema({
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickup:{
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true },
        address: String,
        addressLine1: String,
        place_id: { type: String, required: true }
    },
    destination:{
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true },
        address: String,
        addressLine1: String,
        place_id: { type: String, required: true }
    },
    departureDate: {
        type: Date,
        required: true
    },
    estimatedTimeOfArrival: {
        type: Date,
        required: true
    },
    carName:{
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },   
    availableSeats:{
        type: Number,
        required: true
    },
    passengers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});


export const Ride = mongoose.model("Ride", rideSchema);