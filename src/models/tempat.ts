import { randomUUID } from "crypto";
import { Document, Model, Schema } from "mongoose";
import mongoose, { connectDatabase } from "../config/database";

export interface ITempat {
  tempatId: string;
  namaTempat: string;
  statusTempat: string;
}

interface ITempatDocument extends ITempat, Document {}

type FindAllOptions = {
  where?: Partial<ITempat>;
  attributes?: Array<keyof ITempat>;
};

const tempatSchema = new Schema<ITempatDocument>(
  {
    tempatId: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    namaTempat: {
      type: String,
      required: true,
    },
    statusTempat: {
      type: String,
      required: true,
    },
  },
  {
    collection: "tempat",
    versionKey: false,
    timestamps: false,
  }
);

const TempatModel: Model<ITempatDocument> =
  (mongoose.models.Tempat as Model<ITempatDocument>) ||
  mongoose.model<ITempatDocument>("Tempat", tempatSchema);

class Tempat implements ITempat {
  public tempatId: string;
  public namaTempat: string;
  public statusTempat: string;

  constructor(data: ITempat) {
    this.tempatId = data.tempatId;
    this.namaTempat = data.namaTempat;
    this.statusTempat = data.statusTempat;
  }

  private static toEntity(doc: ITempatDocument): Tempat {
    return new Tempat({
      tempatId: doc.tempatId,
      namaTempat: doc.namaTempat,
      statusTempat: doc.statusTempat,
    });
  }

  static async create(data: Partial<ITempat>): Promise<Tempat> {
    await connectDatabase();
    const document = await TempatModel.create({
      tempatId: data.tempatId || randomUUID(),
      namaTempat: data.namaTempat,
      statusTempat: data.statusTempat,
    });

    return Tempat.toEntity(document);
  }

  static async findAll(options?: FindAllOptions): Promise<any[]> {
    await connectDatabase();

    const query = options?.where ? { ...options.where } : {};

    if (options?.attributes?.length) {
      const projection = options.attributes.join(" ");
      return TempatModel.find(query).select(projection).lean();
    }

    const documents = await TempatModel.find(query);
    return documents.map((doc) => Tempat.toEntity(doc));
  }

  static async findByPk(tempatId: string): Promise<Tempat | null> {
    await connectDatabase();
    const document = await TempatModel.findOne({ tempatId });
    return document ? Tempat.toEntity(document) : null;
  }

  async save(): Promise<Tempat> {
    await connectDatabase();
    const document = await TempatModel.findOneAndUpdate(
      { tempatId: this.tempatId },
      {
        namaTempat: this.namaTempat,
        statusTempat: this.statusTempat,
      },
      { new: true }
    );

    if (!document) {
      throw new Error("Tempat not found");
    }

    this.namaTempat = document.namaTempat;
    this.statusTempat = document.statusTempat;
    return this;
  }

  async destroy(): Promise<void> {
    await connectDatabase();
    await TempatModel.deleteOne({ tempatId: this.tempatId });
  }
}

export default Tempat;
