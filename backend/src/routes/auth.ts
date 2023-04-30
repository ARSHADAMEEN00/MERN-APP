import express from "express";
import passport from "passport";

const router = express.Router();

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
