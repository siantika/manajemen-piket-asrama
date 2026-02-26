import mongoose, { connectDatabase } from "../config/database";

async function testConnection() {
  try {
    await connectDatabase();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await mongoose.connection.close();
  }
}

testConnection();
