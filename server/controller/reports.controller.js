import { Report } from "../models/Report.js";

export const getAllReports = async(req, res)=>{
    const { userId } = req.query;
    try{
        const allReports = await Report.find({ user: userId }).populate('user').populate('reportedBy');
        console.log("Reports: ", allReports);
        return res.status(200).json({ msg: "Fetched All Rights", reports: allReports });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const addReport = async(req, res)=>{
    const { userId, info, relevantDocs } = req.body;
    try{
        const authenticatedUserId = req.session.passport.user.user._id;
        const newReport = new Report({
            user: userId,
            info: info,
            relevantDocs: relevantDocs,
            reportedBy: authenticatedUserId
        });

        const savedReport = await newReport.save();
        console.log("Saved Report: ", savedReport);

        return res.status(200).json({ msg: "Report Submitted Successfully", report: savedReport });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const deleteReport = async(req, res)=>{
    const { reportId } = req.query;
    try{
        const deletedReport = await Report.findByIdAndDelete(reportId);
        console.log("Deleted Report: ", deletedReport);

        return res.status(200).json({ msg: "Deleted Report Successfully" })
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}