import cron from "node-cron";
import {
  generateScheduleNow,
  saveGeneratedPiketNow,
} from "../buat-jadwal/buat-jadwal";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";
import { createPiketHistoris } from "../historis/historis";
import { getAllPikets, removeAllPiket } from "../manajemen-jadwal-piket-sekarang/piket-sekarang";

// Define types for better type safety
type RiwayatPiket = {
  nama: string;
  tempat: string;
  tanggalPiket: Date;
  statusPiket: "belum" | "sudah";
};

export const startCronjobs = () => {
  // Cron job for generating schedule
  cron.schedule(CONST.CRON_JOB.GENERATE_SCHEDULE_TIME, async () => {
    try {
      logger.info("Cron job: Generating schedule...");
      const jadwalPiket = await generateScheduleNow();
      await saveGeneratedPiketNow(jadwalPiket);
      logger.info("Cron job: Generating schedule completed successfully.");
    } catch (error) {
      logger.error(`Cron job: Generating schedule failed. Error message: ${error}`);
    }
  });

  // Cron job for weekly task
  cron.schedule(CONST.CRON_JOB.POST_SCHEDULE_TIME, async () => {
    try {
      logger.info("Cron job: Weekly task starting...");
      await savePiketHistoris();
      await removeAllPiket();
      logger.info("Cron job: Weekly task completed successfully.");
    } catch (error) {
      logger.error(`Cron job: Weekly task failed. Error message: ${error}`);
    }
  });
};

export const savePiketHistoris = async () => {
  try {
    const allRiwayatPiket: RiwayatPiket[] = await getAllPikets();
    for (const eachRiwayatPiket of allRiwayatPiket) {
      const { nama, tempat, tanggalPiket, statusPiket } = eachRiwayatPiket;
      await createPiketHistoris(nama, tempat, tanggalPiket, statusPiket);
    }
  } catch (error) {
    logger.error(`Failed to process riwayat piket. Error message: ${error}`);
  }
};
