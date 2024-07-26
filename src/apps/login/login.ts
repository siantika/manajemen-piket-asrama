import bcrypt from "bcryptjs";
import Admin from "../../models/admin";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginAdmin = async (username: string, plainPassword: string) => {
  try {
    const admin = await Admin.findOne({ where: { adminUserName: username } });

    if (!admin) {
      return {
        success: false,
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      };
    }

    const isMatch = await bcrypt.compare(plainPassword, admin.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: admin.adminId, username: admin.adminUserName, role:admin.role},
        process.env.JWT_SECRET || 'null',
        { expiresIn: "1h" }
      );
      return {
        success: true,
        status: StatusCodes.OK,
        message: "Login successful",
        token,
      };
    } else {
      return {
        success: false,
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      };
    }
  } catch (error) {
    logger.error("Error during login:", error);
    return {
      success: false,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    };
  }
};
