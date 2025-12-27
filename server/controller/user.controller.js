import { User } from "../models/User";

export const getUsers = async(req, res)=>{
    try{
        const userId = req.session.passport.user.user._id;
        const foundUsers = await User.find({
            _id: { $ne:  userId }
        });
        console.log("Found Users: ", foundUsers);

        return res.status(200).json({ users: users })
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}