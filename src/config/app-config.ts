import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import viewsRoute from "../routes/views";
import apiRoutes from "../routes/api";
import { errorHandler } from "../middlewares/error-handler";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // Set security headers
app.use(cookieParser(process.env.COOKIE_SECRET || "default-secret"));
app.use(cors());

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
