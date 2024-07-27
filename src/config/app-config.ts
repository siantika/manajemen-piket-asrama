import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import viewsRoute from "../routes/views";
import apiRoutes from "../routes/api";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Set security headers
app.use(cors());

// Front End rendering server middlewares
app.use(express.static(path.join(__dirname, "../../public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

// Register routes
app.use(apiRoutes);
app.use(viewsRoute);

export default app;
