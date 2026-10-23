import express from "express";
import {middlewareLogResponses, middlewareMetricsInc, errorMiddleware} from "./api/middleware.js";
import {handlerReadiness, handlerServerHits, handlerResetHits} from "./api/admin.js";
import {handlerValidateChirp} from "./api/chirps.js";

const app = express();
const PORT = 8090;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerServerHits);

app.post("/admin/reset", handlerResetHits);

app.post("/api/validate_chirp", handlerValidateChirp);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
