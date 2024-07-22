import sequelize from "./config/database";

async function testConnection() {
  try {
    // Coba melakukan koneksi ke database
    await sequelize.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Menutup koneksi setelah pengujian selesai
    await sequelize.close();
  }
}

testConnection();
