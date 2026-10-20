import { Response } from "express";

export function respondWithJSON(res: Response, statusCode: number, payload: unknown) {
  res.status(statusCode).send(payload);
}

export function respondWithError(res: Response, statusCode: number, message: string) {
  respondWithJSON(res, statusCode, { error: message });
}
