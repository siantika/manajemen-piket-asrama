import app from "./config/app-config";
import CONST from "./config/consts";
import { errorHandler } from "./middlewares/error-handler";
import routes from "./routes/render";

app.use(routes);
app.use(errorHandler);

// Start the server
app.listen(CONST.PORT, () => {
  console.log(`Server is running on http://localhost:${CONST.PORT}`);
});
