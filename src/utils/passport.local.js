const bcrypt = require("bcrypt");

module.exports = (passport, db_users) => {
    const LocalStrategy = require("passport-local").Strategy;
    function isValidPassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    }

    function createHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }

    passport.use(
        "local-login",
        new LocalStrategy(async (username, password, done) => {
            let user = null;
            try {
                // This is used to avoid users being able to login to facebook users with local
                user = await db_users.knex.from("users").where({ username: username }).andWhere({ authMethod: "local" });
                user = user[0];
            } catch (err) {
                console.log("Error in login: " + err);
                return done(err);
            }
            if (!user) {
                const error = "User not found with username " + username;
                console.log(error);
                return done(error, false);
            }

            if (!isValidPassword(user, password)) {
                const error = "Invalid Password";
                console.log(error);
                return done(error, false);
            }
            return done(null, user);
        })
    );

    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                passReqToCallback: true,
            },

            async (req, username, password, done) => {
                let user = null;
                const email = req.body.email
                try {
                    user = await db_users.knex.from("users").where({ username: username }).orWhere({ email: email });
                    user = user[0];
                } catch (err) {
                    console.log("Error in SignUp: " + err);
                    return done(err);
                }

                if (user) {
                    const error = "User already exists";
                    console.log(error);
                    return done(error, false);
                }

                const newUser = {
                    username: req.body.username,
                    password: createHash(password),
                    email: req.body.email,
                    profilePhoto: req.body.profilePhoto,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    authMethod: "local",
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
