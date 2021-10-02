import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many api calls from this IP, please try again later.",
});

export default apiRateLimiter;
