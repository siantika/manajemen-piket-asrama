import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface untuk atribut yang dimiliki model Member
export interface IMember {
  memberId: string;
  memberName: string;
  created_at?: Date; 
  updated_at?: Date;
}

// Atribut yang dapat digunakan saat pembuatan model (kecuali primaryKey)
interface MemberCreationAttributes extends Optional<IMember, 'memberId'> {}

// Kelas model Member
class Member extends Model<IMember, MemberCreationAttributes> implements IMember {
  public memberId!: string;
  public memberName!: string;
  public readonly created_at?: Date; 
  public readonly updated_at?: Date;
}

// Inisialisasi model dengan konfigurasi
Member.init(
  {
    memberId: {
      type: DataTypes.UUID,
      field: 'id',
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberName: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Member',
    tableName: 'penghuni',
    timestamps: true, 
    createdAt: 'created_at', // Map Sequelize's createdAt to DB's createdat
    updatedAt: 'updated_at', 
  }
);

export default Member;
