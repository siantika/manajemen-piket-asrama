import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { logger } from "../../../utils/logger";
import { loginAdmin } from "./login";

// Validasi skema
const adminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});

export const loginAdminHandler = async (req: Request, res: Response) => {
  const { error } = adminSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid username or password",
    });
  }

  const { username, password } = req.body;

  try {
    const response = await loginAdmin(username, password);
    if (!response.success){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid credential",
      });
    }

    res.cookie("authToken", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(StatusCodes.OK).json(
      {
        message: "login succeed",
      }
    );

  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

export const validateSessionHandler = async (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({
    message: "Session valid",
  });
};

export const logoutAdminHandler = async (req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(StatusCodes.OK).json({
    message: "Logout succeed",
  });
};
