import { Request, Response } from "express";
import Joi from "joi";
import { getAllPikets, removeAllPiket, updatePiket } from "./piket-sekarang";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../utils/logger";
import {
  generateScheduleTask,
  recapResultTask,
} from "../routine-tasks/jadwal-mingguan";

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
      message: "Data berhasil di baca",
      data: result,
    });
  } catch (error) {
    logger.error(`Gagal membaca daftar piket: ${error}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to read all piket list",
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

// Definisikan skema Joi untuk validasi
const generateScheduleSchema = Joi.object({
  tanggalPiket: Joi.date().required().messages({
    'date.base': 'tanggalPiket must be a valid date',
    'any.required': 'tanggalPiket is required',
  }),
});
export const generateSchedulerHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Validasi request body menggunakan Joi
  const { error, value } = generateScheduleSchema.validate(req.body, {
    allowUnknown: true,
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }

  const { tanggalPiket } = value;

  try {
    // Jalankan tugas generate jadwal
    await generateScheduleTask(tanggalPiket);

    return res.status(StatusCodes.OK).json({
      message: "Generate-schedule task successfully executed",
    });
  } catch (error) {
    // Logging error dengan detail tambahan
    logger.error(
      `Failed to run generate-schedule task for tanggalPiket ${tanggalPiket}: ${error}`
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const recapResultHandler = async (req: Request, res: Response) => {
  try {
    await recapResultTask();
    return res.status(StatusCodes.OK).json({
      message: "Recap task successfully executed",
    });
  } catch (error) {
    logger.error(`Failed to run recap task with error: ${error}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};
