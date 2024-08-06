import cron from "node-cron";
import {
  generateScheduleNow,
  saveGeneratedPiketNow,
} from "../buat-jadwal/buat-jadwal";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";

export const startCronjobs = () => {
  cron.schedule(CONST.CRON_JOB.GENERATE_SCHEDULE_TIME, async () => {
    try {
      logger.info("Cron job: Generating schedule...");
      const jadwalPiket = await generateScheduleNow();
      await saveGeneratedPiketNow(jadwalPiket);
      logger.info("Cron job: Generating schedule completed successfully.");
    } catch (error) {
      logger.error(
        `Cron job: Generating schedule failed. Error message: ${error}`
      );
    }
  });
};
