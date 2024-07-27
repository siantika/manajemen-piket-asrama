import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ITempat {
  tempatId: string;
  placeName: string;
}

interface PlaceCreationAttributes extends Optional<ITempat, "tempatId"> {}

class Tempat
  extends Model<ITempat, PlaceCreationAttributes>
  implements ITempat
{
  public tempatId!: string;
  public placeName!: string;
}

Tempat.init(
  {
    tempatId: {
      type: DataTypes.UUID,
      field: "tempatid",
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    placeName: {
      type: DataTypes.STRING,
      field: "namatempat",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tempat",
    tableName: "tempat",
    timestamps: true,
  }
);

export default Tempat;
