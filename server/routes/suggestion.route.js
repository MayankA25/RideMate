import { Router } from "express";
import { getSuggestion } from "../controller/suggestion.controller.js";



const suggestionRouter = Router();

suggestionRouter.get("/suggestplace", getSuggestion)

export default suggestionRouter;