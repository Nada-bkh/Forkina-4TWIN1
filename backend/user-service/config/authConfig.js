import {config} from "dotenv";

config();

export const jwtConfig = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: "7d", // Token expires in 7 days
    jwtExpirationInMs: 7 * 24 * 60 * 60 * 1000, // Token expires in 7 days (in ms)
};