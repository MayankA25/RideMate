import { Group } from "../models/Group.js";

export const getGroup = async(req, res)=>{
    const { groupId } = req.query;
    try{
        const foundGroup = await Group.findById(groupId).populate('members');
        console.log("Found Group: ", foundGroup);
        return res.status(200).json({ group: foundGroup });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}