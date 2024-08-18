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
      field: "piket_id",
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tempatId: {
      type: DataTypes.UUID,
      field: "tempat_id",
      allowNull: false,
    },
    penghuniId: {
      type: DataTypes.UUID,
      field: "penghuni_id",
      allowNull: false,
    },
    statusPiket: {
      type: DataTypes.ENUM("sudah", "belum"),
      field: "status_piket",
      allowNull: false,
    },
    tanggalPiket: {
      type: DataTypes.DATE,
      field: "tanggal_piket",
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
