import bcrypt from "bcryptjs";
import CONST from "../config/consts";
import mongoose from "../config/database";
import Admin from "../models/admin";

const SALT_ROUNDS = 10;

const seedAdmin = async () => {
  const adminUserName = process.env.ADMIN_SEED_USERNAME || "admin";
  const plainPassword = process.env.ADMIN_SEED_PASSWORD || "Admin@123";

  try {
    const existingAdmin = await Admin.findOne({
      where: { adminUserName },
    });

    if (existingAdmin) {
      console.log(`Admin '${adminUserName}' already exists. Skipping seed.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    await Admin.create({
      adminUserName,
      password: hashedPassword,
      role: CONST.ROLE.ADMIN,
    });

    console.log(`Admin '${adminUserName}' seeded successfully.`);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

void seedAdmin();
