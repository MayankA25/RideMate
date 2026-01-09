import mongoose, { Schema } from "mongoose";



const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    membersJoinedAt: {
        type: Map,
        of: Date,
        default: {}
    }
}, { timestamps: true });


export const Group = mongoose.model('Group', groupSchema);