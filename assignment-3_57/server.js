const express = require("express");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/students", studentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});