import cors from "cors";
import { config } from "./env.js";

export const corsMiddleware = cors({
  origin: config.corsOrigin === "*" ? "*" : [config.corsOrigin, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});