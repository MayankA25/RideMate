import { Router } from "express";
import passport from "passport";
import "../strategies/google-strategy.js";
import {
  callback,
  getSpecificUser,
  getUser,
  logout,
  submitDocument,
  submitForm,
  updateProfilePicture,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const authRouter = Router();

// authRouter.get("/login", passport.authenticate("google", {
//     scope: ["email", "profile"],
//     accessType: "offline",
//     prompt: "consent",
//     approval_prompt: "force"

// }))
// authRouter.get("/callback", passport.authenticate("google", { failureRedirect: "/failed" }), callback);


// authRouter.get("/logout", verifyToken, logout)

authRouter.get(
    "/login",
    passport.authenticate("google", {
        scope: ["profile", "email", "https://mail.google.com/"],
        accessType: "offline",
        prompt: "consent",
        approval_consent: "force",
    })
);

authRouter.get("/getuser", verifyToken, getUser);

authRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5000/api/auth/failed" }),
  callback
);

authRouter.post("/submitform", submitForm);

authRouter.put("/updateprofilepic", verifyToken, updateProfilePicture);

authRouter.post("/submitdocument", verifyToken, submitDocument);

authRouter.get("/getspecificuser", getSpecificUser);

authRouter.post("/logout", verifyToken, logout);

export default authRouter;
