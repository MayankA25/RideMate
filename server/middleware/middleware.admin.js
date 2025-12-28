export const verifyAdminToken = (req, res, next)=>{
    try{
        const user = req?.session?.passport?.user?.user;

        console.log("User: ", user);
        
        if(!user) return res.status(401).json({ msg: "Unauthorized Admin" })

        const isUserSuperAdmin = user.role.includes("SuperAdmin");

        if(!isUserSuperAdmin) return res.status(401).json({ msg: "Unauthorized Admin" });

        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}