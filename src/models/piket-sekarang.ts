import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase, getNextSequence } from "../config/database";

export interface IPiketSekarang {
  id: number;
  tanggalPiket: Date;
  nama: string;
  tempat: string;
  statusPiket: "sudah" | "belum";
}

export interface IPiketSekarangCreationAttributes
  extends Partial<IPiketSekarang> {}

interface IPiketSekarangDocument extends IPiketSekarang, Document {}

const piketSekarangSchema = new Schema<IPiketSekarangDocument>(
  {
    id: { type: Number, required: true, unique: true },
    tanggalPiket: { type: Date, required: true },
    nama: { type: String, required: true },
    tempat: { type: String, required: true },
    statusPiket: {
      type: String,
      enum: ["sudah", "belum"],
      required: true,
    },
  },
  {
    collection: "piket_sekarang",
    versionKey: false,
    timestamps: false,
  }
);

const PiketSekarangModel: Model<IPiketSekarangDocument> =
  (mongoose.models.PiketSekarang as Model<IPiketSekarangDocument>) ||
  mongoose.model<IPiketSekarangDocument>("PiketSekarang", piketSekarangSchema);

class PiketSekarang implements IPiketSekarang {
  public id: number;
  public tanggalPiket: Date;
  public nama: string;
  public tempat: string;
  public statusPiket: "sudah" | "belum";

  constructor(data: IPiketSekarang) {
    this.id = data.id;
    this.tanggalPiket = data.tanggalPiket;
    this.nama = data.nama;
    this.tempat = data.tempat;
    this.statusPiket = data.statusPiket;
  }

  private static toEntity(doc: IPiketSekarangDocument): PiketSekarang {
    return new PiketSekarang({
      id: doc.id,
      tanggalPiket: doc.tanggalPiket,
      nama: doc.nama,
      tempat: doc.tempat,
      statusPiket: doc.statusPiket,
    });
  }

  static async create(
    data: IPiketSekarangCreationAttributes
  ): Promise<any> {
    await connectDatabase();

    const document = await PiketSekarangModel.create({
      id: data.id ?? (await getNextSequence("piket_sekarang_id")),
      tanggalPiket: data.tanggalPiket,
      nama: data.nama,
      tempat: data.tempat,
      statusPiket: data.statusPiket,
    });

    return PiketSekarang.toEntity(document);
  }

  static async findAll(): Promise<any[]> {
    await connectDatabase();
    const documents = await PiketSekarangModel.find().sort({ id: 1 });
    return documents.map((doc) => PiketSekarang.toEntity(doc));
  }

  static async findByPk(id: number): Promise<any | null> {
    await connectDatabase();
    const document = await PiketSekarangModel.findOne({ id });
    return document ? PiketSekarang.toEntity(document) : null;
  }

  static async update(
    updates: Partial<IPiketSekarang>,
    options: { where: { id: number } }
  ): Promise<[number]> {
    await connectDatabase();
    const result = await PiketSekarangModel.updateOne(
      { id: options.where.id },
      updates
    );
    return [result.modifiedCount];
  }

  static async destroy(options: {
    truncate?: boolean;
    restartIdentity?: boolean;
    cascade?: boolean;
    where?: Partial<IPiketSekarang>;
  }): Promise<number> {
    await connectDatabase();

    if (options?.truncate) {
      const result = await PiketSekarangModel.deleteMany({});
      return result.deletedCount ?? 0;
    }

    const result = await PiketSekarangModel.deleteMany(options?.where || {});
    return result.deletedCount ?? 0;
  }

  async destroy(): Promise<void> {
    await connectDatabase();
    await PiketSekarangModel.deleteOne({ id: this.id });
  }
}

export default PiketSekarang;
