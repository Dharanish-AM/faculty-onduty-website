const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const PORT = process.env.PORT || 8000;

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "✅ Faculty OD Management API is running..." });
});

app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
