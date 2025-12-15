import { Request } from "../models/Requests.js";
import { User } from "../models/User.js";
import { mailQueue } from "../utils/queue.js";

export const getAllRequests = async(req, res)=>{
    try{
        const allRequests = await Request.find({}).populate('userId');
        console.log("Requests: ", allRequests);

        return res.status(200).json({ requests: allRequests });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const createRequest = async(req, res)=>{
    const { userId, documentsObject } = req.body;
    try{
        const newRequest = new Request({
            userId: userId,
            documents: documentsObject
        });

        const savedRequest = await newRequest.save();

        return res.status(200).json({ msg: "New Request Created", request: savedRequest });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


export const approveDocument = async(req, res)=>{
    const { userId, documentName } = req.body;
    try{
        const foundRequest = await Request.findOne({ userId: userId }).populate('userId');
        let newRole = foundRequest.userId.role;
        if(documentName == "drivingLicense"){
            newRole = "Passenger/Driver"
        }
        if(!foundRequest) return res.status(400).json({ msg: "Bad Request" });
        const updatedUser = await User.findByIdAndUpdate(userId, {
            [`${documentName}Status`]: 'verified',
            role: newRole
        }, {new: true});
        console.log(updatedUser);
        const senderMail = req.session.passport.user.user.email;
        const recipient = foundRequest.userId.email;
        const accessToken = req.session.passport.user.accessToken;
        const refreshToken = req.session.passport.user.refreshToken;
        const cc = [];
        const bcc = [];

        console.log(senderMail, recipient, accessToken, refreshToken);

        const subject = `Regarding ${documentName == 'aadharCard' ? "Aadhar Card" : "Driving License"} Verification - RideMate`;
        const message = `Your ${documentName == 'aadharCard' ? "Aadhar Card" : "Driving License"} has been verified. Kindly verify it in the Ridemate`;

        console.log("About To Send Mail...")
        await mailQueue.add("mailQueue", { senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment: [] })

        return res.status(200).json({ msg: `${documentName.slice(0,1).toUpperCase()}${documentName.slice(1)} of ${updatedUser.firstName} has been approved by superadmin` })
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
export const rejectDocument = async(req, res)=>{
    const { userId, documentName } = req.body;
    try{
        const foundRequest = await Request.findOne({ userId: userId }).populate('userId');
        if(!foundRequest) return res.status(400).json({ msg: "Bad Request" });

        const mongooseDocuments = foundRequest.documents;
        const documents = mongooseDocuments.map((doc, index)=>Object.fromEntries(doc));

        const foundIndex = documents.findIndex((doc, index)=>Object.keys(doc)[0] == documentName);
        documents.splice(foundIndex, 1);

        console.log("New Docs: ", documents);

        if(documents.length > 0){
            const updatedRequest = await Request.findByIdAndUpdate(foundRequest._id, {
                documents: documents
            }, {new: true});
            console.log("Updated Request: ", updatedRequest)
        }else{
            const deletedRequest = await Request.findByIdAndDelete(foundRequest._id);
            console.log("Deleted Request: ", deletedRequest);
        }

        const senderMail = req.session.passport.user.user.email;
        const recipient = foundRequest.userId.email;
        const accessToken = req.session.passport.user.accessToken;
        const refreshToken = req.session.passport.user.refreshToken;
        const cc = [];
        const bcc = [];

        console.log(senderMail, recipient, accessToken, refreshToken);

        const subject = `Regarding ${documentName == 'aadharCard' ? "Aadhar Card" : "Driving License"} Verification - RideMate`;
        const message = `Your ${documentName == 'aadharCard' ? "Aadhar Card" : "Driving License"} has been rejected/revoked. Kindly reupload the document/documents for verification.`;

        console.log("About To Send Mail...")
        await mailQueue.add("mailQueue", { senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment: [] })

        const updatedUser = await User.findByIdAndUpdate(userId, {
            [`${documentName}Status`]: 'not verified',
            [`${documentName == 'drivingLicense' ? 'driverLicense' : documentName}`] : ''
        }, { new: true })
        console.log("Updated User: ", updatedUser);

        return res.status(200).json({ msg: `${documentName.slice(0,1).toUpperCase()}${documentName.slice(1)} of ${updatedUser.firstName} has been rejected by superadmin` })
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}