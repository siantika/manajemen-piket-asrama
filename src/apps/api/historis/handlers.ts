import { StatusCodes } from "http-status-codes";
import { logger } from "../../../utils/logger";
import { getAllPiketHistoris } from "./historis";
import { Request, Response} from "express";



export const readAllHistorisPikektHandler = async (req: Request, res: Response) => {
    try {
      const members = await getAllPiketHistoris();
      res.status(StatusCodes.OK).json({
        data: members,
      });
    } catch (error: any) {
      logger.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  };