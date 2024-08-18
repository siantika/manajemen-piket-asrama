import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IHisotrisPiket {
  id: number;
  tanggalPiket: Date;
  nama: string;
  tempat: string;
  statusPiket: "sudah" | "belum";
}

export interface IHisotrisPiketCreationAttributes
  extends Optional<IHisotrisPiket, "id"> {}

class HistorisPiket
  extends Model<IHisotrisPiket, IHisotrisPiketCreationAttributes>
  implements IHisotrisPiket
{
  public id!: number;
  public tanggalPiket!: Date;
  public nama!: string;
  public tempat!: string;
  public statusPiket!: "sudah" | "belum";
}

HistorisPiket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "piket_id"
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
    modelName: "historis",
    tableName: "historis",
    timestamps: false,
  }
);

export default HistorisPiket;
