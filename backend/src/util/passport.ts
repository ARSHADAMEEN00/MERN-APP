import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import validateEnv from "./validateEnv";
const GoogleStrategy = passportGoogle.Strategy;
import UserModel from "../models/user"

passport.use(
    new GoogleStrategy(
        {
            clientID: validateEnv.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: validateEnv.GOOGLE_AUTH_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await UserModel.findOne({ googleId: profile.id });

            // If user doesn't exist creates a new user. (similar to sign up)
            if (!user) {
                const newUser = await UserModel.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0].value,
                    // we are using optional chaining because profile.emails may be undefined.
                });
                if (newUser) {
                    done(null, newUser);
                }
            } else {
                done(null, user);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
});