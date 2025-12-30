import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { io } from "../utils/socket.js";

export const getMessages = async(req, res)=>{
    const { groupId } = req.query;
    try{
        const messages = await Message.find({group: groupId}).populate('sender').populate('group').populate('parentId');

        console.log("Messages: ", messages);

        return res.status(200).json({ messages: messages });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const sendMessage = async(req, res)=>{
    const { senderId, groupId, text, rideId } = req.body;

    try{

        const newMessage = new Message({
            sender: senderId,
            group: groupId,
            text: text
        });

        const savedMessage = await newMessage.save();

        const newGroupMessage = await (await (await savedMessage.populate('sender')).populate('group')).populate('parentId')
        
        io.to(rideId).emit('newGroupMessage', newGroupMessage);

        return res.status(200).json({ msg: "Message has been sent successfully", message: savedMessage });

    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const updateMessage = async(req, res)=>{
    const { messageId, newText, rideId } = req.body;

    try{
        const updatedMessage = await Message.findByIdAndUpdate(messageId, {
            text: newText
        }, { new: true }).populate('group').populate('sender').populate('parentId');

        console.log("Updated Message: ", updatedMessage);

        io.to(rideId).emit('updatedGroupMessage', updatedMessage)

        return res.status(200).json({ msg: "Message has beem updated", message: updatedMessage });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const deleteMessage = async(req, res)=>{
    const { messageId, rideId } = req.query;

    try{
        await Message.findByIdAndDelete(messageId);

        io.to(rideId).emit("deletedGroupMessageId", messageId);

        return res.status(200).json({ msg: "Message Deleted Successfully" });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const replyToMessage = async(req, res)=>{
    const { senderId, groupId, text, parentId, rideId } = req.body;
    try{

        const foundMessage = await Message.findById(parentId).populate('sender').populate('group').populate('parentId');

        const newMessage = new Message({
            sender: senderId,
            group: groupId,
            text: text,
            parentId: parentId,
            parentSenderName: `${foundMessage.sender.firstName} ${foundMessage.sender.lastName}`
        });

        const savedReply = await newMessage.save();
        console.log("Saved Reply: ", savedReply);

        const newReply = await (await (await savedReply.populate('sender')).populate('group')).populate('parentId');

        io.to(rideId).emit("newGroupMessage", newReply);

        return res.status(200).json({ msg: "Reply Send Successfully" });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}