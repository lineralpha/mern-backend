import { ConnectionStates } from "mongoose";

// weird enough - if I use import and new, the model cannot connect to the db
var mongoose: any; //  = new Mongoose();
var db: any;

export const connectMongoDb = async () => {
    mongoose = require("mongoose");

    try {
        // "mongodb://admin:password@localhost:27017/test",
        // "mongodb+srv://admin:Thisisawesome@cluster-tryme.yjjgh.mongodb.net/mydb?retryWrites=true&w=majority",
        await mongoose.connect(process.env.MONGODB_URI!, {
            connectTimeoutMS: 5000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // database: "mydb"
        db = mongoose.connection.db;

        console.log(`environment: ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV !== "production") {
            console.info("mongodb connected.");
            console.info(
                `database: ${db.databaseName}. connection state: ${mongoose.STATES[mongoose.connection.readyState]}`
            );
            console.info(`mongoose: ${mongoose.version}`);
            let admin = mongoose.connection.db.admin();
            let info = await admin.serverInfo();
            console.info(`mongodb server: ${info?.version}`);
        }

        return mongoose;
    } catch (e) {
        console.error("Failed to connect to mongodb.");
        console.error(e);

        await closeConnection();
        throw e;
    }
};

export const closeConnection = async () => {
    if (db) {
        await mongoose.disconnect();
        console.info("mongodb disconnected.");
    }
};

export const getDatabase = () => {
    return db;
};
