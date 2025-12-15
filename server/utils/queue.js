import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const mailQueue = new Queue("mailQueue", { connection: connection });