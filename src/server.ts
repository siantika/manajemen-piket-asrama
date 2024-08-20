import app from "./config/app-config";
import CONST from "./config/consts";

// Start the server
app.listen(CONST.PORT, () => {
  console.log(`Server is running on http://localhost:${CONST.PORT}`);
});

export default app;