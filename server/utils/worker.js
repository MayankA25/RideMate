import { Worker } from "bullmq"
import { sendMail } from "./email.js";
import { connection } from "./redis.js";

const worker = new Worker("mailQueue", async(job)=>{
    console.log("Worker....");
    const { senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment } = job.data;
    await sendMail(senderMail, recipient, accessToken, refreshToken, subject, message, cc, bcc, attachment);
}, { connection: connection })


worker.on("completed", (job)=>{
    console.log("Worker: Email Sent Successfully: ", job.data.recipient);
})

worker.on("failed", (job)=>{
    console.log("Worker: Failed To Send Email To: ", job.data.recipient);
})