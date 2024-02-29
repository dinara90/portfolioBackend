require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Example route to handle requests to '/uploads/filename'
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send("File not found");
  }

  // Serve the image file
  res.sendFile(imagePath);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`server port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
