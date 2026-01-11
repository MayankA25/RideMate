import mongoose, { Schema } from "mongoose";


const rideAlertSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickup: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number],  required: true},
        address: { type: String, required: true },
        addressLine1: { type: String },
        place_id: { type: String, required: true }
    },
    destination: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true },
        address: { type: String, required: true },
        addressLine1: { type: String },
        place_id: { type: String, required: true },
    },
    departureDate: {
        type: Date,
        required: true
    },
    numberOfPassengers: {
        type: Number,
        required: true
    }
});


export const RideAlert = mongoose.model('RideAlert', rideAlertSchema);