import MongoStore from "connect-mongo";

// const mongoose = require('mongoose');
// const sessionConnection = mongoose.createConnection(process.env.MONGODB_ATLAS_URI, {
//     connectTimeoutMS: 5000,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

require('dotenv').config();

const sessionStore = new MongoStore({
    mongoUrl: process.env.MONGODB_ATLAS_URI,
    mongoOptions: {
        connectTimeoutMS: 5000,
    },
    collectionName: 'sessions',
});

export default sessionStore;
