// buat server
const express = require("express");
// koneksi mongodb
const mongoose = require("mongoose");
// untuk akses api
const cors = require("cors");
// baca file .env
require("dotenv").config();

// aplikasi server dari express
const app = express();

// middleware
app.use(cors());
app.use(express.json());
// PINTU MASUK API route aplikasi
app.use("/api/tasks", require("./routes/taskRoutes"));

// route
app.get("/", (req, res) => {
  res.send("Server running...");
});

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
// ambil port dari env
const PORT = process.env.PORT || 5000;
// jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
