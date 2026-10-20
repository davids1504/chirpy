import {Request, Response} from "express";
import {config} from "../config.js";

export const handlerReadiness = (req: Request, res: Response) => {
    res.status(200); // Automatically set to 200, this is redundant
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
};

export const handlerServerHits = (req: Request, res: Response) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`
        <html lang="EN">
        <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileserverHits} times!</p>
        </body>
        </html>`);
}

export const handlerResetHits = (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.send("Hits reset");
}
