import app from "./app.js";
import { config } from "./config/env.js";

app.listen(config.port, () => {
  console.log(`[Backend Grupo 12] Servidor corriendo en puerto ${config.port} en modo ${config.nodeEnv}`);
});