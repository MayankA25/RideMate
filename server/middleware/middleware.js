import { User } from "../models/User.js";

export const verifyToken = async(req, res, next)=>{
    try{
        const user = req.session?.passport?.user?.user;

        console.log("User: ", user);
        console.log("BOOL: ", !user);

        if(!req.session.passport || !user) return res.status(401).json({ msg: "Unauthenticated" });

        console.log("MW User: ", user);

        const email = user?.email;
        const foundUser = await User.findOne({ email: email });

        if(!foundUser || foundUser.isBanned) return res.status(401).json({ msg: "Unauthenticated" });

        return next();

    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}