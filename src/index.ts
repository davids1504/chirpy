import express from "express";
import {Request, Response, NextFunction} from "express";
import {config} from "./config.js";
import {respondWithJSON, respondWithError} from "./json.js";

const app = express();
const PORT = 8090;
const maxChirpLength = 140;
const profanities = ["kerfuffle", "sharbert", "fornax"];

type ChirpRequestBody = {
    body: string;
};

const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode != 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    })
    next();
}

const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
    config.fileserverHits++;
    next();
}

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());

const handlerReadiness = (req: Request, res: Response) => {
    res.status(200); // Automatically set to 200, this is redundant
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
};

const handlerServerHits = (req: Request, res: Response) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

const handlerResetHits = (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.send("Hits reset");
}

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerServerHits);

app.post("/admin/reset", handlerResetHits);

app.post("/api/validate_chirp", (req: Request, res: Response) => {

    try {
        const params: ChirpRequestBody = req.body;
        if (!params.body || typeof params.body !== "string") {
            respondWithError(res, 400, "Invalid request body");
            return;
        }
        if (params.body.length > maxChirpLength) {
            respondWithError(res, 400, "Chirp is too long");
            return;
        }
        const responseWords = params.body.split(" ");
        for (const word of responseWords) {
            if (profanities.includes(word.toLowerCase())) {
                responseWords[responseWords.indexOf(word)] = "****";
            }
        }

        let filteredResponse = responseWords.join(" ");

        respondWithJSON(res, 200, {cleanedBody: filteredResponse});
    } catch (error) {
        respondWithError(res, 400, "Something went wrong");
        return;
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});