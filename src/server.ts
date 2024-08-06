import { startCronjobs } from "./apps/api/cron-jobs/jadwal-mingguan";
import app from "./config/app-config";
import CONST from "./config/consts";
import { errorHandler } from "./middlewares/error-handler";

app.use(errorHandler);

startCronjobs();

// Start the server
app.listen(CONST.PORT, () => {
  console.log(`Server is running on http://localhost:${CONST.PORT}`);
});

