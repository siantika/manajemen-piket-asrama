import bcrypt from "bcryptjs";
import Admin from "../../../models/admin";
import { logger } from "../../../utils/logger";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginAdmin = async (username: string, plainPassword: string) => {
  try {
    const admin = await Admin.findOne({ where: { adminUserName: username } });

    if (!admin) {
      throw new Error("Admin is not found!");
    }

    const isMatch = await bcrypt.compare(plainPassword, admin.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: admin.adminId, username: admin.adminUserName, role:admin.role},
        process.env.JWT_SECRET || 'null',
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
