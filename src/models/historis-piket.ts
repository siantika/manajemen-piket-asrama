import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase, getNextSequence } from "../config/database";

export interface IHisotrisPiket {
  id: number;
  tanggalPiket: Date;
  nama: string;
  tempat: string;
  statusPiket: "sudah" | "belum";
}

export interface IHisotrisPiketCreationAttributes
  extends Partial<IHisotrisPiket> {}

interface IHistorisPiketDocument extends IHisotrisPiket, Document {}

const historisPiketSchema = new Schema<IHistorisPiketDocument>(
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
    collection: "historis",
    versionKey: false,
    timestamps: false,
  }
);

const HistorisPiketModel: Model<IHistorisPiketDocument> =
  (mongoose.models.HistorisPiket as Model<IHistorisPiketDocument>) ||
  mongoose.model<IHistorisPiketDocument>("HistorisPiket", historisPiketSchema);

class HistorisPiket implements IHisotrisPiket {
  public id: number;
  public tanggalPiket: Date;
  public nama: string;
  public tempat: string;
  public statusPiket: "sudah" | "belum";

  constructor(data: IHisotrisPiket) {
    this.id = data.id;
    this.tanggalPiket = data.tanggalPiket;
    this.nama = data.nama;
    this.tempat = data.tempat;
    this.statusPiket = data.statusPiket;
  }

  private static toEntity(doc: IHistorisPiketDocument): HistorisPiket {
    return new HistorisPiket({
      id: doc.id,
      tanggalPiket: doc.tanggalPiket,
      nama: doc.nama,
      tempat: doc.tempat,
      statusPiket: doc.statusPiket,
    });
  }

  static async create(
    data: IHisotrisPiketCreationAttributes
  ): Promise<HistorisPiket> {
    await connectDatabase();

    const document = await HistorisPiketModel.create({
      id: data.id ?? (await getNextSequence("historis_id")),
      tanggalPiket: data.tanggalPiket,
      nama: data.nama,
      tempat: data.tempat,
      statusPiket: data.statusPiket,
    });

    return HistorisPiket.toEntity(document);
  }

  static async findAll(): Promise<HistorisPiket[]> {
    await connectDatabase();
    const documents = await HistorisPiketModel.find().sort({ id: 1 });
    return documents.map((doc) => HistorisPiket.toEntity(doc));
  }

  static async findByPk(id: number): Promise<HistorisPiket | null> {
    await connectDatabase();
    const document = await HistorisPiketModel.findOne({ id });
    return document ? HistorisPiket.toEntity(document) : null;
  }

  static async update(
    updates: Partial<IHisotrisPiket>,
    options: { where: { id: number } }
  ): Promise<[number]> {
    await connectDatabase();
    const result = await HistorisPiketModel.updateOne(
      { id: options.where.id },
      updates
    );

    return [result.modifiedCount];
  }

  static async destroy(options: {
    truncate?: boolean;
    restartIdentity?: boolean;
    cascade?: boolean;
    where?: Partial<IHisotrisPiket>;
  }): Promise<number> {
    await connectDatabase();

    if (options?.truncate) {
      const result = await HistorisPiketModel.deleteMany({});
      return result.deletedCount ?? 0;
    }

    const result = await HistorisPiketModel.deleteMany(options?.where || {});
    return result.deletedCount ?? 0;
  }

  async destroy(): Promise<void> {
    await connectDatabase();
    await HistorisPiketModel.deleteOne({ id: this.id });
  }
}

export default HistorisPiket;
