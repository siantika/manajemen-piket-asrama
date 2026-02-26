import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Admin from "../../../models/admin";
import { logger } from "../../../utils/logger";

dotenv.config();

export const loginAdmin = async (username: string, plainPassword: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  try {
    const admin = await Admin.findOne({ where: { adminUserName: username } });

    if (!admin) {
      throw new Error("Admin is not found!");
    }

    const isMatch = await bcrypt.compare(plainPassword, admin.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: admin.adminId, username: admin.adminUserName, role:admin.role},
        jwtSecret,
        { expiresIn: "1d" }
      );
      return {
        success: true,
        token,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    logger.error("Error during login:", error);
    return {
      success: false,
    };
  }
};
