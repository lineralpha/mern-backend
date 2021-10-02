import express from "express";
import { StatusCodes } from "http-status-codes";
import session from "../types/express-session-augment";

const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        // Validate augmented session
        if (req.session.viewCount) {
            req.session.viewCount++;
        } else {
            req.session.viewCount = 1;
        }
        console.log(req.session);

        return res.status(StatusCodes.OK).send({
            message: `Hello, you visited us ${req.session.viewCount} time(s).`,
        });
    } catch (error) {
        // console.error(error);
        // res.redirect('/error');

        // Letting it throw without catching would result in "UnhandledPromiseRejectionWarning"
        // which causing the client to wait endlessly for the response.
        next(error);
    }
});

export { router as homeRouter };
