import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { loginAdmin } from "../../api/login/login";
import { StatusCodes } from "http-status-codes";

// Define the type for adminCredential
interface AdminCredential {
  success: boolean;
  token?: string;
  username?: string;
}

export const loginAdminHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const adminCredential: AdminCredential = await loginAdmin(
      username,
      password
    );

    if (adminCredential.success && adminCredential.token) {
      // Simpan token dalam cookie HttpOnly
      res.cookie("token", adminCredential.token, {
        httpOnly: true, // Cookie hanya dapat diakses melalui HTTP(S)
        secure: false, // Set ke true jika menggunakan HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Cookie berlaku selama 1 hari
      });

      res
        .status(StatusCodes.OK)
        .json({ message: "Login successed", user: adminCredential.username });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credential" });
    }
  } catch (error) {
    logger.error(`Login failed, ${error}`);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid credential" });
  }
};
