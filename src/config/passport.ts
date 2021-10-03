import passport from "passport";
import passportLocal from "passport-local";
import { find } from "lodash";

import User, { IUser, UserModelInterface } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { connectMongoDb, closeConnection } from "../db/dbConnection";
import { custom } from "joi";

passport.serializeUser<any, any>((req, user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectMongoDb();
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    } finally {
        await closeConnection();
    }
});

const LocalStrategy = passportLocal.Strategy;
const customFields = {
    usernameField: "username",
    passwordField: "password",
};

passport.use(
    new LocalStrategy(customFields, async (username, password, done) => {
        try {
            connectMongoDb();
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: `User ${username} not found` });
            }

            const isValid = user.validatePassword(password);
            if (isValid) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Wrong password" });
            }
        }
        catch (err) {
            return done(err, false, { message: "Invalid username or password" })
        }
        finally {
            closeConnection();
        }
    }
));

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    // Authentication failure
    res.redirect("/login");
};

const isAuthorized = (req: Request, res: Response, next: NextFunction) => {};

export { isAuthenticated, isAuthorized };
