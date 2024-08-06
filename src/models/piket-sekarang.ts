import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IPiketSekarang {
  id: number;
  tanggalPiket: Date;
  nama: string;
  tempat: string;
  statusPiket: "sudah" | "belum";
}

export interface IPiketSekarangCreationAttributes
  extends Optional<IPiketSekarang, "id"> {}

class PiketSekarang
  extends Model<IPiketSekarang, IPiketSekarangCreationAttributes>
  implements IPiketSekarang
{
  public id!: number;
  public tanggalPiket!: Date;
  public nama!: string;
  public tempat!: string;
  public statusPiket!: "sudah" | "belum";
}

PiketSekarang.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggalPiket: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "tanggal_piket",
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nama",
    },
    tempat: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "tempat",
    },
    statusPiket: {
      type: DataTypes.ENUM("sudah", "belum"),
      field: "status_piket",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PiketSekarang",
    tableName: "piket_sekarang",
    timestamps: false,
  }
);

export default PiketSekarang;
