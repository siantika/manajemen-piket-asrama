import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./utils/logger";
import { LihatDaftarPiket } from "./apps/lihatDaftarPiket/types";

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Set security headers
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Sample data
const piketData = [
  { nama: "Sian", tempat: "Dapur" },
  { nama: "Arbi", tempat: "Kamar Mandi" },
  { nama: "Yoga", tempat: "Tamu" },
  { nama: "Agus", tempat: "Dapur" },
];

const tanggalPiket = "Minggu, 17 Juli 2024";

// Routes setup
app.get("/", (req: Request, res: Response) => {
  const data: LihatDaftarPiket = { piketData, tanggalPiket };
  res.render("home", data);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  logger.error(err.stack);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
