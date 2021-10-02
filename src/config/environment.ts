import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" });
}

if (fs.existsSync(".env.development")) {
    // dotenv.config({path: ".env.development"});

    // Override environment variables
    let envConfig = dotenv.parse(fs.readFileSync(".env.development"));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

export const MONGODB_URI = process.env.MONGODB_URI;
export const API_PORT = process.env.API_PORT;
