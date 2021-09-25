import express, { Application } from "express";
import { json } from "body-parser";
import { StatusCodes } from "http-status-codes";
import { todoRouter } from "./routes/todo";
import { closeConnection, connectMongoDb } from "./db/dbConntion";
import { Server } from "http";

// must be configured as early as possible so that environment variables are
// incorporated into process.env early before any usage.
require("dotenv").config();

const port = process.env.API_PORT || 3001;
const app: Application = express();
var server: Server;

// https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program
function gracefullyExit() {
    server?.close(async (err) => {
        await closeConnection();
        console.log("Express shut down gracefully");
        !!err ? process.exit(1) : process.exit(0);
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

app.use(json())
    .use(express.urlencoded({ extended: true }))
    .use(todoRouter)
    .use((err: any, req: any, res: any, next: any) => {
        if (err.name === "CustomError" && err.message === "EmptyResponse") {
            return res.status(StatusCodes.NOT_FOUND).send("Not Found");
        }
        // ... more error cases go here
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Interval Server Error");
    });

app.get("/", async (req, res) => {
    return res.status(StatusCodes.OK).send({
        message: "Hello World!",
    });
});

process.on("SIGTERM", gracefullyExit);
process.on("SIGINT", gracefullyExit);
process.on("SIGKILL", gracefullyExit);

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
