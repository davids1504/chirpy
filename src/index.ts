import express from "express";
import { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8090;

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

const handlerReadiness = (req: Request, res: Response) => {
  res.status(200); // Automatically set to 200, this is redundant
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
};

const handlerServerHits = (req: Request, res: Response) => {
  res.send(`Hits: ${config.fileserverHits}`);
}

const handlerResetHits = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.send("Hits reset");
}

app.get("/api/healthz", handlerReadiness);

app.get("/api/metrics", handlerServerHits);

app.get("/api/reset", handlerResetHits);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});