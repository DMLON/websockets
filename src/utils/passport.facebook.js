module.exports = (passport, db_users) => {
    const FacebookStrategy = require("@passport-next/passport-facebook").Strategy;

    const dotenv = require("dotenv");
    dotenv.config();

    const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } = process.env;

    passport.use(
        new FacebookStrategy(
            {
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: "/auth/facebook/callback",
                profileFields: ["id", "displayName", "photos", "emails"],
                scope: ["email"],
                graphApiVersion: "v2.5",
                passReqToCallback: true,
            },
            async function (req, accessToken, refreshToken, profile, done) {
                // No need to check password due to beign a facebook user
                let user = null;
                const email = profile.emails[0]?.value;
                try {
                    user = await db_users.knex.from("users").where({ email: email });
                    user = user[0];
                } catch (err) {
                    console.log("Error in SignUp: " + err);
                    return done(err);
                }

                if (user) {
                    console.log("User already exists");
                    // here it's good that the user exists
                    return done(null, user);
                }
                const splittedName = profile.displayName.split(" ");
                const newUser = {
                    username: profile.displayName,
                    password: createHash("facebook"),
                    email: email,
                    profilePhoto: profile.photos[0]?.value,
                    firstName: splittedName[0],
                    lastName: profile.displayName.split(" ").splice(1, splittedName.length),
                    authMethod: "facebook",
                };

                try {
                    await db_users.save(newUser);
                } catch (err) {
                    console.log("Error in Saving user: " + err);
                    return done(err);
                }
                console.log(newUser);
                console.log("User Registration succesful");
                return done(null, newUser);
            }
        )
    );
    return passport;
};
