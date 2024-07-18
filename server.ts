import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './src/utils/logger';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Set security headers
app.use(cors()); // Enable CORS

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  logger.error(err.stack);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
