import dotenv from "dotenv";
import mongoose, { Document, Model, Schema } from "mongoose";
import path from "path";

// Relative path to .env file (Important)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/manajemen_piket";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};

interface ICounter extends Document {
  name: string;
  value: number;
}

const counterSchema = new Schema<ICounter>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const CounterModel: Model<ICounter> =
  (mongoose.models.Counter as Model<ICounter>) ||
  mongoose.model<ICounter>("Counter", counterSchema, "counters");

export const getNextSequence = async (name: string): Promise<number> => {
  await connectDatabase();

  const counter = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return counter?.value ?? 1;
};

export default mongoose;
