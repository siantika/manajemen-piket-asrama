import { randomUUID } from "crypto";
import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase } from "../config/database";

export interface IMember {
  memberId: string;
  memberName: string;
  created_at?: Date;
  updated_at?: Date;
}

interface IMemberDocument extends IMember, Document {}

const memberSchema = new Schema<IMemberDocument>(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    memberName: {
      type: String,
      required: true,
    },
  },
  {
    collection: "penghuni",
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const MemberModel: Model<IMemberDocument> =
  (mongoose.models.Member as Model<IMemberDocument>) ||
  mongoose.model<IMemberDocument>("Member", memberSchema);

class Member implements IMember {
  public memberId: string;
  public memberName: string;
  public created_at?: Date;
  public updated_at?: Date;

  constructor(data: IMember) {
    this.memberId = data.memberId;
    this.memberName = data.memberName;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  private static toEntity(doc: IMemberDocument): Member {
    return new Member({
      memberId: doc.memberId,
      memberName: doc.memberName,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    });
  }

  static async create(data: Partial<IMember>): Promise<Member> {
    await connectDatabase();
    const document = await MemberModel.create({
      memberId: data.memberId || randomUUID(),
      memberName: data.memberName,
    });

    return Member.toEntity(document);
  }

  static async findAll(): Promise<Member[]> {
    await connectDatabase();
    const documents = await MemberModel.find().sort({ created_at: 1 });
    return documents.map((doc) => Member.toEntity(doc));
  }

  static async findByPk(memberId: string): Promise<Member | null> {
    await connectDatabase();
    const document = await MemberModel.findOne({ memberId });
    return document ? Member.toEntity(document) : null;
  }

  async save(): Promise<Member> {
    await connectDatabase();
    const document = await MemberModel.findOneAndUpdate(
      { memberId: this.memberId },
      { memberName: this.memberName },
      { new: true }
    );

    if (!document) {
      throw new Error("Member not found");
    }

    this.memberName = document.memberName;
    this.created_at = document.created_at;
    this.updated_at = document.updated_at;
    return this;
  }

  async destroy(): Promise<void> {
    await connectDatabase();
    await MemberModel.deleteOne({ memberId: this.memberId });
  }
}

export default Member;
