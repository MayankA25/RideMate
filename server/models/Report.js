import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    info: {
        type: String,
        required: true
    },
    relevantDocs: [{
        type: String,
        required: true
    }],
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


export const Report = mongoose.model('Report', reportSchema);