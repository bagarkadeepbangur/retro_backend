const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

// Gracefully close connection when app is stopped
const handleShutdown = async () => {
  try {
    console.log("🛑 Gracefully shutting down...");
    await mongoose.connection.close(); // ⬅️ FIXED: Removed callback
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

module.exports = connectDB;
