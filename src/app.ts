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
import "./config/passport";
import { userLoginRouter } from "./routes/userLogin";

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
    // for debugging purpose
    .use((req, res, next) => {
        console.log(req.session);
        console.log(req.user);
        next();
    })
    .use(helmet())
    .use(cors())
    .use(apiRateLimiter);

// add all routers
app.use(homeRouter)
    .use(userLoginRouter)
    .use(todoRouter);

export default app;
