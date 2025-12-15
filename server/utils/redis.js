import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" });

let redis;

console.log("URI: ", process.env.REDIS_URI)

if(!redis){
    redis = new IORedis(process.env.REDIS_URI, {
        maxRetriesPerRequest: null
    })
}

export const connection = redis;