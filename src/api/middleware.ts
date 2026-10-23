import {Request, Response, NextFunction} from "express";
import {config} from "../config.js";
import {NotFoundError, UserForbiddenError, UserNotAuthenticatedError, BadRequestError} from "./errors.js";
import {respondWithError} from "../json.js";

export const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    })
    next();
}

export const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
    config.fileserverHits++;
    next();
}

export function errorMiddleware(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }

    respondWithError(res, statusCode, message);
}
