import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase, getNextSequence } from "../config/database";

export interface IAdmin {
  adminId: number;
  adminUserName: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  role: string;
}

interface IAdminDocument extends IAdmin, Document {}

type FindOneOptions = {
  where: Partial<Pick<IAdmin, "adminUserName" | "adminId">>;
};

const adminSchema = new Schema<IAdminDocument>(
  {
    adminId: {
      type: Number,
      required: true,
      unique: true,
    },
    adminUserName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    collection: "admins",
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const AdminModel: Model<IAdminDocument> =
  (mongoose.models.Admin as Model<IAdminDocument>) ||
  mongoose.model<IAdminDocument>("Admin", adminSchema);

class Admin implements IAdmin {
  public adminId: number;
  public adminUserName: string;
  public password: string;
  public created_at?: Date;
  public updated_at?: Date;
  public role: string;

  constructor(data: IAdmin) {
    this.adminId = data.adminId;
    this.adminUserName = data.adminUserName;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.role = data.role;
  }

  private static toEntity(doc: IAdminDocument): Admin {
    return new Admin({
      adminId: doc.adminId,
      adminUserName: doc.adminUserName,
      password: doc.password,
      role: doc.role,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    });
  }

  static async create(data: Partial<IAdmin>): Promise<Admin> {
    await connectDatabase();

    const document = await AdminModel.create({
      adminId: data.adminId ?? (await getNextSequence("admin_id")),
      adminUserName: data.adminUserName,
      password: data.password,
      role: data.role,
    });

    return Admin.toEntity(document);
  }

  static async findOne(options: FindOneOptions): Promise<Admin | null> {
    await connectDatabase();
    const where = options?.where || {};
    const document = await AdminModel.findOne(where);
    return document ? Admin.toEntity(document) : null;
  }
}

export default Admin;
