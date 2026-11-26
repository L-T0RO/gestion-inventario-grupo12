import { Router } from "express";
import productosRoutes from "./productos.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.success({ status: "UP", timestamp: new Date().toISOString() }, "API Prototipo Grupo 12 en funcionamiento");
});

router.use("/productos", productosRoutes);

export default router;