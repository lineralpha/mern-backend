import express, { Application } from "express";
import session from "express-session";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { todoRouter } from "./routes/todo";
import { closeConnection, connectMongoDb } from "./db/dbConntion";
import sessionStore from "./utils/sessionStore";

// todo: how to move this to a separate file?
declare module "express-session" {
    interface SessionData {
        viewCount: number;
    }
}

// must be configured as early as possible so that environment variables are
// incorporated into process.env early before any usage.
require("dotenv").config();

const port = process.env.API_PORT || 3001;
const app: Application = express();
var server: Server;

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many api calls from this IP, please try again later.",
});

// add middlewares
// - they are triggered sequentially based on their sequential order.
// - they operate until the process exits, or the response has been sent back to the client.
app.use(json())
    .use(urlencoded({ extended: true }))
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
    .use(morgan("tiny"))
    .use(helmet())
    .use(cors())
    .use(rateLimiter)
    .use(todoRouter);

app.get("/", async (req, res, next) => {
    try {
        // throw new Error("Hello error!");

        console.log(req.session);
        // add additional information to the session object.
        if (req.session.viewCount) {
            req.session.viewCount++;
        } else {
            req.session.viewCount = 1;
        }
        return res.status(StatusCodes.OK).send({
            message: `Hello World! You visited us ${req.session.viewCount} time(s).`,
        });
    } catch (error) {
        // letting it throw without catching would result in "UnhandledPromiseRejectionWarning"
        // which causing the client to wait endlessly for the response.
        next(error); // default error handler
        // custom error handler
        // console.error(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("My internal server error!");
        // res.redirect('/error');
    }
});

// handle "not found". It is not the result of an error, the error handler will not capture them.
// https://expressjs.com/en/starter/faq.html
app.use((req, res, next) => {
    console.error(`${req.url} not found.`);
    res.status(StatusCodes.NOT_FOUND).send(`<h2>Oops! ${req.path} not found.</h2>`);
});

// last error handler, must be in the last place of the chain.
app.use((err: any, req: any, res: any, next: any) => {
    console.error("You reached internal server error.");
    console.error(err);
    // ... handle more specific errors first, then the last
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("<h1>Interval Server Error 2</h1>");
});

process.on("SIGTERM", gracefullyExit);
process.on("SIGINT", gracefullyExit);
process.on("SIGKILL", gracefullyExit);
// probably not a good idea to bring the entire server down
// process.on('uncaughtException', gracefullyExit);

try {
    server = app.listen(port, async () => {
        // await connectMongoDb();
        // await connectMongoDbServer();
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error occurred: ${error.message}`);
    } else {
        console.error(error);
    }
}

// https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program
function gracefullyExit() {
    server?.close(async (err) => {
        await closeConnection();
        console.log("Express shut down gracefully");
        if (!!err) {
            console.error(err);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
}

// unused. do not remove
async function connectMongoDbServer() {
    const mongoose = require("mongoose");

    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
            connectTimeoutMS: 5000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to mongo database.");
        console.log(mongoose.connection.db.databaseName, mongoose.connection.readyState);

        const names = Object.keys(await mongoose.connection.db.collections());
        console.log(names);
    } catch (e) {
        console.error("DB connection error");
        console.error(e);
        throw e;
    }
}
