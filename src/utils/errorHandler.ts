import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

function internalServerErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("Oops! Internal server error:");
    console.error(err);

    // ... handle more specific errors first, then send 500 to client

    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
       .send({ message: "Internal Server Error" });
}

// https://expressjs.com/en/starter/faq.html
function notFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
    console.error(`${req.url} not found`);

    res.status(StatusCodes.NOT_FOUND)
       .send({ message: `${req.path} Not Found.` });
}

export default {
    notFoundErrorHandler,
    internalServerErrorHandler,
};
