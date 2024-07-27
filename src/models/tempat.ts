import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ITempat {
  tempatId: string;
  namaTempat: string;
}

interface PlaceCreationAttributes extends Optional<ITempat, "tempatId"> {}

class Tempat
  extends Model<ITempat, PlaceCreationAttributes>
  implements ITempat
{
  public tempatId!: string;
  public namaTempat!: string;
}

Tempat.init(
  {
    tempatId: {
      type: DataTypes.UUID,
      field: "tempatid",
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    namaTempat: {
      type: DataTypes.STRING,
      field: "namatempat",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tempat",
    tableName: "tempat",
    timestamps: false,
  }
);

export default Tempat;
