import { Request, Response } from "express";
import { addAdmin } from "./daftar-admin";
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../utils/logger";

// Validasi skema
const adminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const registerAdmin = async (req: Request, res: Response) => {
  const { error } = adminSchema.validate(req.body);

  if (error) {
    logger.error(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid input",
    });
  }

  const { username, password } = req.body;

  try {
    await addAdmin(username, password);
    return res.status(StatusCodes.CREATED).json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
