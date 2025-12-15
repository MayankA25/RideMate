import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })

console.log(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET)


const getTransporter = (senderEmail, accessToken, refreshToken)=>{
    console.log("Sender Email: ", senderEmail)
    console.log("Access Token: ", accessToken);
    console.log("Refresh TOken: ", refreshToken);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            type:"OAuth2",
            user: senderEmail,
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            accessToken: accessToken,
            refreshToken: refreshToken
        },
        pool: true,
        maxConnections: 5,
        rateLimit: 5
    });

    return transporter
}

export const sendMail = async (senderEmail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment)=>{
    console.log("Inside Sending Mail....");
    const transporter = getTransporter(senderEmail, accessToken, refreshToken);

    const mailOptions = {
        from: senderEmail,
        to: recipient,
        cc: cc,
        bcc: bcc,
        subject: subject,
        html: message,
        attachment: attachment
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log("Email Sent To: ", recipient)
    }catch(e){
        console.log(e);
        console.log("Error While Sending Mail To: ", recipient);
        throw new Error("Error While Sending Mail")
    }
}