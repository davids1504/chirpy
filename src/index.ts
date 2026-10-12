import express from "express";
import { Request, Response } from "express";

const app = express();
const PORT = 8090;

app.use("/app", express.static("./src/app"));

const handlerReadiness = (req: Request, res: Response) => {
  res.status(200); // Automatically set to 200, this is redundant
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
};

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});