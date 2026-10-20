import {Request, Response, NextFunction} from "express";
import {config} from "../config.js";

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

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(err);
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}
