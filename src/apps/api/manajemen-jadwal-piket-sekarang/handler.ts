import { Request, Response } from "express";
import Joi from "joi";
import { getAllPikets, removeAllPiket, updatePiket } from "./piket-sekarang";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../utils/logger";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().optional(),
  tempatPiket: Joi.string().optional(),
  tanggalPiket: Joi.date().optional(),
  status: Joi.string().valid("belum", "sudah").optional(),
});


export const readAllPiketHandlers = async (req: Request, res: Response) => {
  try { 
    const result = await getAllPikets();
    return res.status(StatusCodes.OK).json({
      message:"Data berhasil di baca",
      data: result,
    });
  } catch (error) {
    logger.error(`Gagal membaca daftar piket: ${error}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to read all piket list"
    });
  }
};

export const updatePiketHandler = async (req: Request, res: Response) => {
  try {
    const { id, status, tempatPiket } = req.body;
    const { error } = updateSchema.validate({
      id,
      status,
      tempatPiket,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Validation error: ${error.message}`,
      });
    }

    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "ID is required",
      });
    }

    const updatedPiket = await updatePiket(id, {
      statusPiket: status,
      tempat: tempatPiket,
    });

    return res.status(StatusCodes.OK).json({
      message: "Data updated successfully",
      data: updatedPiket,
    });
  } catch (error) {
    logger.error(`Error updating piket: ${error}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const deletePiketHandler = async (req: Request, res: Response) => {
  try {
    await removeAllPiket();
    logger.info("Success remove all piket records");
    return res.status(StatusCodes.NO_CONTENT).json({
      message: "Successfully deleted all piket records",
    });
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};
