import { Router } from "express";
import { getSuggestion } from "../controller/suggestion.controller.js";
import { verifyToken } from "../middleware/middleware.js";



const suggestionRouter = Router();

suggestionRouter.get("/suggestplace",verifyToken, getSuggestion)

export default suggestionRouter;