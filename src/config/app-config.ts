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
app.use(express.urlencoded({ extended: false }));
app.use(helmet()); // Set security headers
app.use(cors());
// IMPORTANT: api routes must prior the views routes!
app.use(apiRoutes);

// Front End rendering server middlewares
// Serve static files
app.use(express.static(path.join(__dirname, "../../public")));
// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));
app.use(viewsRoute);

export default app;
