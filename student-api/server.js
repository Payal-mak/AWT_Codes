const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/students", studentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});