const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const app = express();

const PORT = process.env.PORT || 4000;

// Connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("Connected to MongoDB");
});

// Apply middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/auth", userRoute);

app.listen(PORT, () => {
  console.log(`Server listening, visit: http://localhost:${PORT}`);
});
