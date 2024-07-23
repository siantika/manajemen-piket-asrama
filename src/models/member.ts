import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface untuk atribut yang dimiliki model Member
export interface IMember {
  memberId: string;
  memberName: string;
  createdat?: Date; // Add createdat and updatedat to the interface
  updatedat?: Date;
}

// Atribut yang dapat digunakan saat pembuatan model (kecuali primaryKey)
interface MemberCreationAttributes extends Optional<IMember, 'memberId'> {}

// Kelas model Member
class Member extends Model<IMember, MemberCreationAttributes> implements IMember {
  public memberId!: string;
  public memberName!: string;
  public readonly createdat?: Date; // Ensure these are included
  public readonly updatedat?: Date;
}

// Inisialisasi model dengan konfigurasi
Member.init(
  {
    memberId: {
      type: DataTypes.UUID,
      field: 'idasrama',
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    memberName: {
      type: DataTypes.STRING,
      field: 'namapenghuni',
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      field: 'createdat',
      allowNull: false,
    },
    updatedat: {
      type: DataTypes.DATE,
      field: 'updatedat',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Member',
    tableName: 'penghuni',
    timestamps: true, // This is necessary to enable automatic timestamp management
    createdAt: 'createdat', // Map Sequelize's createdAt to your DB's createdat
    updatedAt: 'updatedat', // Map Sequelize's updatedAt to your DB's updatedat
  }
);

export default Member;
