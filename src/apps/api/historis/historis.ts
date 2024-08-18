import Joi from "joi";
import HistorisPiket from "../../../models/historis-piket";
import { logger } from "../../../utils/logger";

// Definisikan tipe untuk update parsial
export type HistorisPiketUpdate = {
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
export const createPiketHistoris = async (
  name: string,
  tempatPiket: string,
  tanggalPiket: Date,
  statusPiket: "belum" | "sudah",
) => {
  try {
    // Validasi data menggunakan skema Joi
    const { error } = addSchema.validate({ name, tempatPiket, tanggalPiket });
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    // Menambahkan HistorisPiket
    const newPiket = await HistorisPiket.create({
      nama: name,
      tempat: tempatPiket,
      tanggalPiket: tanggalPiket,
      statusPiket: statusPiket,
    });
    return newPiket;
  } catch (error) {
    logger.error("Error adding HistorisPiket: ", error);
    throw new Error("Failed to add HistorisPiket");
  }
};

// Fungsi untuk membaca semua jadwal
export const getAllPiketHistoris = async () => {
  try {
    const schedules = await HistorisPiket.findAll();
    return schedules;
  } catch (error) {
    logger.error("Error reading all schedules: ", error);
    throw new Error("Failed to read all schedules");
  }
};

// Fungsi untuk memperbarui jadwal
export const updatePiketHistoris = async (id: number, updates: HistorisPiketUpdate) => {
  try {
    // Memperbarui HistorisPiket
    const [affectedRows] = await HistorisPiket.update(updates, {
      where: { id },
    });

    if (affectedRows === 0) {
      throw new Error("HistorisPiket not found");
    }

    // Mengambil record yang diperbarui
    const updatedHistorisPiket = await HistorisPiket.findByPk(id);

    if (!updatedHistorisPiket) {
      throw new Error("HistorisPiket not found after update");
    }

    return updatedHistorisPiket;
  } catch (error) {
    logger.error("Error updating HistorisPiket: ", error);
    throw new Error("Failed to update HistorisPiket");
  }
};

// Fungsi untuk menghapus Piket
export const removePiketHistoris = async (id: number) => {
  try {
    // Validasi ID menggunakan skema Joi
    const { error } = deleteSchema.validate({ id });
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    // Menemukan dan menghapus HistorisPiket
    const piketSekarang = await HistorisPiket.findByPk(id);
    if (!piketSekarang) {
      throw new Error("HistorisPiket not found");
    }
    await piketSekarang.destroy();
    return piketSekarang;
  } catch (error) {
    logger.error("Error deleting HistorisPiket: ", error);
    throw new Error("HistorisPiket not found");
  }
};

export const removeAllPiketHistoris = async () => {
  try {
    await HistorisPiket.destroy({
      truncate: true,
      restartIdentity: true,  
      cascade: false  
    });
  } catch (error) {
    throw new Error(`Failed to remove all piket records: ${error}`);
  }
};
