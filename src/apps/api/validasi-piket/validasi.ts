import PiketSekarang from "../../../models/piket-sekarang";
import { logger } from "../../../utils/logger";

export const toggleStatusPiket = async (id: number): Promise<void> => {
    try {
      const record = await PiketSekarang.findByPk(id);
      if (!record) {
        throw new Error(`Record with ID ${id} not found`);
      }

      const newStatus = record.statusPiket === 'belum' ? 'sudah' : 'belum';
      await record.update({ statusPiket: newStatus });
      logger.info('Status piket toggled successfully.');
    } catch (error) {
      logger.error('Error toggling status piket:', error);
      throw error;
    }
  };
  