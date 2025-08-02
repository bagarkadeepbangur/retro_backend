const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const boardRoutes = require("./routes/boardRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
  }));

app.use(express.json());

app.use("/api/boards", boardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
