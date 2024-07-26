import sequelize from "../../src/config/database";

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
