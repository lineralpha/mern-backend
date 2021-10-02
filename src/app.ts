import express, { Application } from "express";
import compression from "compression";
import session from "express-session";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";

import sessionStore from "./config/sessionStore";
import apiRateLimiter from "./utils/apiRateLimiter";

import { homeRouter } from "./routes/home";
import { todoRouter } from "./routes/todo";

// for authentication
import User from "./models/User";
import { genPassword, validatePassword } from "./utils/passwordUtil";

////////////////////////////////////////////////////////////////////////////////

const app: Application = express();

// Add express middlewares
// - They are triggered sequentially based on their sequential order.
// - They operate until the process exits, or the response has been sent back to the client.
app.use(compression())
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(morgan("dev"))
    .use(
        session({
            saveUninitialized: false,
            resave: true,
            secret: "my session secret",
            store: sessionStore,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            },
        })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use(helmet())
    .use(cors())
    .use(apiRateLimiter);

// add all routers
app.use(homeRouter).use(todoRouter);

app.post(
    "/api/login",
    passport.authenticate("local", { failureRedirect: "/login-failure", successRedirect: "/login-success" }),
    async (req, res, next) => {
        // with these redirections, we don't have to do anything here
    }
);

app.post("api/register", async (req, res, next) => {
    const saltHash = genPassword(req.body.passwd);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        password: hash,
        salt: salt,
    });

    newUser.save();
});

app.get("/api/logout", async (req, res, next) => {
    req.logout();
    res.redirect("/success-logout");
});

export default app;
