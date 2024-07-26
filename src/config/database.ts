import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST!,
  username: process.env.DB_USER!,
  password: "admin123", 
  database: "manajemen-piket-asrama",
});

export default sequelize;
