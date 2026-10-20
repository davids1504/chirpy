import {Request, Response} from "express";
import {respondWithJSON, respondWithError} from "../json.js";

const maxChirpLength = 140;
const profanities = ["kerfuffle", "sharbert", "fornax"];

type ChirpRequestBody = {
    body: string;
};

export const handlerValidateChirp = async (req: Request, res: Response) => {

    const params: ChirpRequestBody = req.body;
    if (!params.body || typeof params.body !== "string") {
        respondWithError(res, 400, "Invalid request body");
        return;
    }
    if (params.body.length > maxChirpLength) {
        throw new Error("Chirp is too long");
    }
    const responseWords = params.body.split(" ");
    for (const word of responseWords) {
        if (profanities.includes(word.toLowerCase())) {
            responseWords[responseWords.indexOf(word)] = "****";
        }
    }

    let filteredResponse = responseWords.join(" ");

    respondWithJSON(res, 200, {cleanedBody: filteredResponse});
};
