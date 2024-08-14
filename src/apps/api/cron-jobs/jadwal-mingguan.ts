import cron from "node-cron";
import {
  generateScheduleNow,
  saveGeneratedPiketNow,
} from "../buat-jadwal/buat-jadwal";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";
import { deleteAllRiwayatPiket } from "../buat-jadwal/helpers";

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
    // Cron job yang dieksekusi setiap minggu pada hari Minggu pukul 23:59
    cron.schedule('59 23 * * 0', async () => {
      try {
        logger.info("Cron job: Weekly task starting...");
        await deleteAllRiwayatPiket();
        logger.info("Cron job: Weekly task completed successfully.");
      } catch (error) {
        logger.error(
          `Cron job: Weekly task failed. Error message: ${error}`
        );
      }
    });
};
