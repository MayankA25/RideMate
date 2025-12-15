import dotenv from "dotenv";

dotenv.config({ path: "D:\\Mayank Data\\CODING\\RideMate\\server\\.env" })


export const getSuggestions = async(place)=>{
    console.log("Place: ", place);
    const newPlace = place.split(" ").join("%20");
    console.log("New Place: ", newPlace)
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${newPlace}&apiKey=${process.env.GEOAPIFY_API_KEY}`);
    const parsedData = await response.json();

    console.log("Data: ", parsedData);

    console.log(parsedData.features);

    return parsedData
}


// getSuggestion("Raja Bhoj");