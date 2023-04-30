import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/", (req, res, next) => {
    if (!req.user) {
        res.redirect("/auth/login");
    } else {
        next();
    }
    res.render("profile", { user: req.user });
});

router.get("/login", (req, res) => {
    if (req.user) {
        res.redirect("/profile");
    }
    res.render("login");
});

router.get("/logout", (req, res) => {
    req.logout((err) => err);
    res.redirect("/");
});




export default router;
