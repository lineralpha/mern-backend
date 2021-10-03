// .env must be imported as early as possible so that environment variable settings
// are incorporated into process.env early enough before any usage.
import "./config/environment";

import http, { Server } from "http";
import devErrorHandler from "errorhandler";
import prodErrorHandler from "./utils/errorHandler";
import app from "./app";
import { closeConnection } from "./db/dbConnection";

// .env validation
console.log("API_PORT", process.env.API_PORT);

// Anything other than 'development' is treated as 'production'.
const prod = process.env.NODE_ENV !== "development";
const port = process.env.API_PORT || 3001;
var server: Server;

if (prod) {
    app.use(prodErrorHandler.notFoundErrorHandler);
    app.use(prodErrorHandler.internalServerErrorHandler);
} else {
    app.use(devErrorHandler());
}

process.on("SIGTERM", gracefullyExit);
process.on("SIGINT", gracefullyExit);
process.on("SIGKILL", gracefullyExit);
// Probably not a good idea to bring the entire server down
// process.on('uncaughtException', gracefullyExit);
// process.on('unhandledRejection', gracefullyExit);

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

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

// unused. do not remove for now
async function connectMongoDbServer() {
    const mongoose = require("mongoose");

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
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
