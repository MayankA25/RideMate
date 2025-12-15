import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })

export const getEstimatedTimeOfArrival = async(departureDate, departurePoint, arrivalPoint)=>{
    try{
        console.log("Departure Date: ", departureDate);
        console.log("Deparutre Point: ", departurePoint);
        console.log("Arrival Point: ", arrivalPoint);
        const response = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${departurePoint[0]}%2C${departurePoint[1]}%7C${arrivalPoint[0]}%2C${arrivalPoint[1]}&mode=drive&apiKey=${process.env.GEOAPIFY_API_KEY}`);
        const parsedData = await response.json();
        console.log("parsed data: ", parsedData.features);
        console.log("Parsed Data: ", parsedData.features[0].properties);
        const timeInSeconds = parsedData.features[0].properties.time;
        console.log("Time: ", timeInSeconds);
        const hour = Number.parseInt(timeInSeconds/3600);
        console.log("Quotient: ", Number.parseInt(hour));
        const remainder = timeInSeconds - 3600*hour;
        console.log("Remainder: ", remainder);
        const minutes = Number.parseInt(remainder / 60);
        console.log("Minutes: ", Number.parseInt(minutes));

        const totalTimeInSeconds = hour*3600 + minutes*60 ;
        const newDateTime = new Date(departureDate).getTime()/1000 + totalTimeInSeconds;
        
        const estimatedISOString = new Date(newDateTime*1000).toISOString();

        console.log("ETA: ", estimatedISOString)
        return estimatedISOString;
    }catch(e){
        console.log(e)
    }
}


const departurePoint = [23.2599, 77.4126]
const arrivalPoint = [28.7041, 77.1025];

// getEstimatedTimeOfArrival(departurePoint, arrivalPoint);


// getEstimatedTimeOfArrival("2025-11-27T13:49:00", departurePoint, arrivalPoint);

