import app from './config/app-config';
import { errorHandler } from './middlewares/error-handler';
import routes from './routes/render';

app.use(routes);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
