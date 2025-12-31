import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },

    parentSenderName: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    },
    
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });


export const Message = mongoose.model("Message", messageSchema);