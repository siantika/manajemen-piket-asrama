import { randomUUID } from "crypto";
import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase } from "../config/database";

export interface IRiwayatPiket {
  piketId: string;
  tempatId: string;
  penghuniId: string;
  statusPiket: "sudah" | "belum";
  tanggalPiket: Date;
}

interface IRiwayatPiketDocument extends IRiwayatPiket, Document {}

const riwayatPiketSchema = new Schema<IRiwayatPiketDocument>(
  {
    piketId: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    tempatId: {
      type: String,
      required: true,
    },
    penghuniId: {
      type: String,
      required: true,
    },
    statusPiket: {
      type: String,
      enum: ["sudah", "belum"],
      required: true,
    },
    tanggalPiket: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "riwayat_piket",
    versionKey: false,
    timestamps: false,
  }
);

const RiwayatPiketModel: Model<IRiwayatPiketDocument> =
  (mongoose.models.RiwayatPiket as Model<IRiwayatPiketDocument>) ||
  mongoose.model<IRiwayatPiketDocument>("RiwayatPiket", riwayatPiketSchema);

class RiwayatPiket implements IRiwayatPiket {
  public piketId: string;
  public tempatId: string;
  public penghuniId: string;
  public statusPiket: "sudah" | "belum";
  public tanggalPiket: Date;

  constructor(data: IRiwayatPiket) {
    this.piketId = data.piketId;
    this.tempatId = data.tempatId;
    this.penghuniId = data.penghuniId;
    this.statusPiket = data.statusPiket;
    this.tanggalPiket = data.tanggalPiket;
  }

  private static toEntity(doc: IRiwayatPiketDocument): RiwayatPiket {
    return new RiwayatPiket({
      piketId: doc.piketId,
      tempatId: doc.tempatId,
      penghuniId: doc.penghuniId,
      statusPiket: doc.statusPiket,
      tanggalPiket: doc.tanggalPiket,
    });
  }

  static async create(data: Partial<IRiwayatPiket>): Promise<RiwayatPiket> {
    await connectDatabase();

    const document = await RiwayatPiketModel.create({
      piketId: data.piketId || randomUUID(),
      tempatId: data.tempatId,
      penghuniId: data.penghuniId,
      statusPiket: data.statusPiket,
      tanggalPiket: data.tanggalPiket,
    });

    return RiwayatPiket.toEntity(document);
  }

  static async findAll(): Promise<IRiwayatPiket[]> {
    await connectDatabase();
    const documents = await RiwayatPiketModel.find().sort({ tanggalPiket: 1 });
    return documents.map((doc) => RiwayatPiket.toEntity(doc));
  }

  static async destroy(options: {
    where?: Partial<IRiwayatPiket>;
    truncate?: boolean;
  }): Promise<number> {
    await connectDatabase();

    if (options?.truncate) {
      const result = await RiwayatPiketModel.deleteMany({});
      return result.deletedCount ?? 0;
    }

    const result = await RiwayatPiketModel.deleteMany(options?.where || {});
    return result.deletedCount ?? 0;
  }
}

export default RiwayatPiket;
