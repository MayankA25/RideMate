import { Router } from "express";
import { upload } from "../utils/multer.js";
import { uploadFile } from "../controller/file.controller.js";


const fileRouter = Router();

fileRouter.post("/upload", upload.array("files"), uploadFile);

export default fileRouter;