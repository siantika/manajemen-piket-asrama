import Joi from "joi";
import CONST from "../../../config/consts";
import PiketSekarang from "../../../models/piket-sekarang";
import { logger } from "../../../utils/logger";

// Definisikan tipe untuk update parsial
export type PiketSekarangUpdate = {
  name?: string;
  tempat?: string;
  tanggalPiket?: Date;
  statusPiket?: "belum" | "sudah";
};

// Schema validasi
const addSchema = Joi.object({
  name: Joi.string().required(),
  tempatPiket: Joi.string().required(),
  tanggalPiket: Joi.date().required(),
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

// Fungsi untuk menambah Piket
export const createPiket = async (
  name: string,
  tempatPiket: string,
  tanggalPiket: Date
) => {
  try {
    // Validasi data menggunakan skema Joi
    const { error } = addSchema.validate({ name, tempatPiket, tanggalPiket });
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    // Menambahkan PiketSekarang
    const newPiket = await PiketSekarang.create({
      nama: name,
      tempat: tempatPiket,
      tanggalPiket: tanggalPiket,
      statusPiket: CONST.STATUS_PIKET.BELUM,
    });
    return newPiket;
  } catch (error) {
    logger.error("Error adding PiketSekarang: ", error);
    throw new Error("Failed to add PiketSekarang");
  }
};

// Fungsi untuk membaca semua jadwal
export const getAllPikets = async () => {
  try {
    const schedules = await PiketSekarang.findAll();
    return schedules;
  } catch (error) {
    logger.error("Error reading all schedules: ", error);
    throw new Error("Failed to read all schedules");
  }
};

// Fungsi untuk memperbarui jadwal
export const updatePiket = async (id: number, updates: PiketSekarangUpdate) => {
  try {
    // Memperbarui PiketSekarang
    const [affectedRows] = await PiketSekarang.update(updates, {
      where: { id },
    });

    if (affectedRows === 0) {
      throw new Error("PiketSekarang not found");
    }

    // Mengambil record yang diperbarui
    const updatedPiketSekarang = await PiketSekarang.findByPk(id);

    if (!updatedPiketSekarang) {
      throw new Error("PiketSekarang not found after update");
    }

    return updatedPiketSekarang;
  } catch (error) {
    logger.error("Error updating PiketSekarang: ", error);
    throw new Error("Failed to update PiketSekarang");
  }
};

// Fungsi untuk menghapus Piket
export const removePiket = async (id: number) => {
  try {
    // Validasi ID menggunakan skema Joi
    const { error } = deleteSchema.validate({ id });
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    // Menemukan dan menghapus PiketSekarang
    const piketSekarang = await PiketSekarang.findByPk(id);
    if (!piketSekarang) {
      throw new Error("PiketSekarang not found");
    }
    await piketSekarang.destroy();
    return piketSekarang;
  } catch (error) {
    logger.error("Error deleting PiketSekarang: ", error);
    throw new Error("PiketSekarang not found");
  }
};

export const removeAllPiket = async () => {
  try {
    await PiketSekarang.destroy({
      truncate: true,
      restartIdentity: true,  
      cascade: false  
    });
  } catch (error) {
    throw new Error(`Failed to remove all piket records: ${error}`);
  }
};
