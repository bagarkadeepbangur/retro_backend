const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const boardRoutes = require("./routes/boardRoutes");

dotenv.config();
connectDB();

const app = express();
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }));

app.use(
  cors({
    // origin: ["https://taskmanager-frontend-mpcvr9lwv-arkadeep-bags-projects.vercel.app","https://taskmanager-frontend-ten.vercel.app", "http://localhost:3000", "http://localhost:3001","http://localhost:5173"],
    origin: function (origin, callback) {
      if (!origin || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/boards", boardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
