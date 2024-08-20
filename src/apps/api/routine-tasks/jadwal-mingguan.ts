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

export const generateScheduleTask = async (tanggalPiket:Date) => {
  try {
    logger.info("Generating schedule...");
    const jadwalPiket = await generateScheduleNow(tanggalPiket);
    await saveGeneratedPiketNow(jadwalPiket);
    logger.info("Generating schedule completed successfully.");
  } catch (error) {
    logger.error(`Generating schedule failed. Error message: ${error}`);
  }
}

export const recapResultTask = async () => {
  try {
    logger.info("Weekly task starting...");
    await savePiketHistoris();
    await removeAllPiket();
    logger.info("Weekly task completed successfully.");
  } catch (error) {
    logger.error(`Weekly task failed. Error message: ${error}`);
  }
}
