import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// relative path to .env file (Important)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

export default sequelize;
