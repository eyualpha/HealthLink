import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { PORT } from "./configs/env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("HealthLink Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
