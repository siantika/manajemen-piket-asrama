import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IRiwayatPiket {
  piketId: string;
  tempatId: string;
  penghuniId: string;
  kehadiran: "Hadir" | "Tidak Hadir";
  tanggalpiket: Date;
}

interface PlaceCreationAttributes extends Optional<IRiwayatPiket, "piketId"> {}

class RiwayatPiket
  extends Model<IRiwayatPiket, PlaceCreationAttributes>
  implements IRiwayatPiket
{
  public piketId!: string;
  public tempatId!: string;
  public penghuniId!: string;
  public kehadiran!: "Hadir" | "Tidak Hadir";
  public tanggalpiket!: Date;
}

RiwayatPiket.init(
  {
    piketId: {
      type: DataTypes.UUID,
      field: "piketid",
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tempatId: {
      type: DataTypes.UUID,
      field: "tempatid",
      allowNull: false,
    },
    penghuniId: {
      type: DataTypes.UUID,
      field: "penghuniid",
      allowNull: false,
    },
    kehadiran: {
      type: DataTypes.ENUM("Hadir", "Tidak Hadir"),
      field: "kehadiran",
      allowNull: false,
    },
    tanggalpiket: {
      type: DataTypes.DATE,
      field: "tanggalpiket",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RiwayatPiket",
    tableName: "riwayat_piket",
    timestamps: false,
  }
);

export default RiwayatPiket;
