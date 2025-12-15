import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documents: [{
        type: Map,
        of: String,
        default: ()=>new Map()
    }],
    // approvedDocuments: [{
    //     type: Map,
    //     of: Boolean,
    //     default: {}
    // }],
    // rejectedDocuments: [{
    //     type: Map,
    //     of: Boolean,
    //     default: {}
    // }]
}, { timestamps: true });


export const Request = new mongoose.model("Request", requestSchema);