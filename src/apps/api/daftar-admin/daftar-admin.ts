import bcrypt from "bcryptjs";
import Admin from "../../../models/admin";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";

const saltRounds = 10;

export const addAdmin = async (userName: string, plainPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    await Admin.create({
      adminUserName: userName,
      password: hashedPassword,
      role: CONST.ROLE.ADMIN,
    });
    logger.info(`admin with name ${userName} is created!`);
  } catch (error) {
    logger.error(error);
  }
};
