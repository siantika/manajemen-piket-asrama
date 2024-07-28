import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IRiwayatPiket {
  piketId: string;
  tempatId: string;
  penghuniId: string;
  statusPiket: "sudah" | "belum";
  tanggalPiket: Date;
}

interface PlaceCreationAttributes extends Optional<IRiwayatPiket, "piketId"> {}

class RiwayatPiket
  extends Model<IRiwayatPiket, PlaceCreationAttributes>
  implements IRiwayatPiket
{
  public piketId!: string;
  public tempatId!: string;
  public penghuniId!: string;
  public statusPiket!: "sudah" | "belum";
  public tanggalPiket!: Date;
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
    statusPiket: {
      type: DataTypes.ENUM("sudah", "belum"),
      field: "status_piket",
      allowNull: false,
    },
    tanggalPiket: {
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
