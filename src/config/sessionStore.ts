import MongoStore from "connect-mongo";

const sessionStore = new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    mongoOptions: {
        connectTimeoutMS: 5000,
    },
    collectionName: "sessions",
});

export default sessionStore;
