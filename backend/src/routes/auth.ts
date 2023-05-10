import express from "express";
import passport from "passport";
import { loginLimiter } from "../middleware/loginLimiter";
import * as AuthController from "../controllers/auth";
import { authenticateUser } from "../middleware/verifyAuth";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", loginLimiter, AuthController.login);
router.get("/refresh", AuthController.refresh);
router.get("/profile", authenticateUser, AuthController.getAuthenticatedUser);
router.post("/logout", authenticateUser, AuthController.logout);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.send("This is the callback route");
    res.redirect("/profile");
});


export default router;
