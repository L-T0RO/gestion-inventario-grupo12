import express from "express";
import { corsMiddleware } from "./config/cors.js";
import { responseFormatter } from "./middlewares/responseFormatter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(responseFormatter);

app.use("/api/v1", apiRouter);

app.use(errorHandler);

export default app;