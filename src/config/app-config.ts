import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";
import { errorHandler } from "../middlewares/error-handler";
import apiRoutes from "../routes/api";
import viewsRoute from "../routes/views";

dotenv.config();
const app = express();
const cookieSecret = process.env.COOKIE_SECRET;
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!cookieSecret) {
  throw new Error("COOKIE_SECRET is required");
}

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // Set security headers
app.use(cookieParser(cookieSecret));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Front End rendering server middlewares
app.use(express.static(path.join(__dirname, "../../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

// Register routes
app.use(viewsRoute);
app.use(apiRoutes);

app.use(errorHandler);

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

export default app;
