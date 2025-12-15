import { getSuggestions } from "../utils/suggestion.js";


export const getSuggestion = async(req, res)=>{
    const { place } = req?.query;
    console.log("Place: ", place)
    try{
        const possiblePlaces = await getSuggestions(place);
        console.log("Possible Places: ", possiblePlaces);

        return res.status(200).json({ possiblePlaces: place ? possiblePlaces : [] });
    }catch(e){
        console.log(e);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}