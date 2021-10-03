import express from "express";
import { check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import { connectMongoDb, closeConnection } from "../db/dbConnection";
import { generatePassword } from "../utils/passwordUtil";
import User, { UserDoc } from "../models/User";

const router = express.Router();

// don't be confused on when each endpoint is called

// POST to create login credential
router.post("/api/signup", async (req, res, next) => {
    await check("username", "User name must be at least 3 characters").isLength({ min: 3 }).run(req);
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be strong").isStrongPassword().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    let encryptedPassword = generatePassword(req.body.password);

    try {
        await connectMongoDb();

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: "User name already exists"});
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword.hash,
            salt: encryptedPassword.salt,
        });
        await newUser.save();
    }
    catch (err) {
        next(err);
    }
    finally {
        await closeConnection();
    }
});

// GET to validate and retrieve login credential
router.get("/api/login", (req, res, next) => {

    // Let passport do the authentication
    passport.authenticate("local", (err: Error, user: UserDoc, info: IVerifyOptions) =>{
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: "No user is specified" });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(StatusCodes.OK);
        })
    })(req, res, next);

});

// To log the user out
router.get("/api/logout", (req, res, next) => {
    if (!req.user) {
        return res.status(StatusCodes.BAD_REQUEST).send({ message: "No user needs to sign out"})
    }

    req.logout();
    return res.status(StatusCodes.OK);
});

export { router as userLoginRouter };
