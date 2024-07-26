import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IAdmin {
  adminId: string;
  adminUserName: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  role: string;
}

// Atribut yang dapat digunakan saat pembuatan model (kecuali primaryKey)
interface AdminCreationAttributes extends Optional<IAdmin, "adminId"> {}

class Admin extends Model<IAdmin, AdminCreationAttributes> implements IAdmin {
  public adminId!: string;
  public adminUserName!: string;
  public password!: string;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
  public role!: string;
}

Admin.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      field: "id",
      autoIncrement: true,
      primaryKey: true,
    },
    adminUserName: {
      type: DataTypes.STRING,
      field: "username",
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    role: {
      type: DataTypes.STRING,
      field: "role",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admins",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Admin;
