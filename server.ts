import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); // Logging HTTP requests
app.use(helmet()); // Set security headers
app.use(cors()); // Enable CORS

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
// import indexRouter from './src/routes/index';
// import usersRouter from './src/routes/users';

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', (req:any, res:any) => {
    res.send('Hello Piket Asrama!');
});

// Error handling middleware
app.use((err:any, req:any, res:any, next:any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
