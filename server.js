const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/cors.config");
const userRoute = require("./routes/user.route");
const productRoute = require("./routes/product.route");
const reviewRoute = require("./routes/review.route");
const orderRoute = require("./routes/order.route");
const summaryRoute = require("./routes/summary.route");
const paymentRoute = require("./routes/payment.route");
const app = express();

const PORT = process.env.PORT || 4000;

// Connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("Connected to MongoDB");
});

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoute);
app.use("/api/summary", summaryRoute);
app.use("/api/payments", paymentRoute);

app.listen(PORT, () => {
  console.log(`Server listening, visit: http://localhost:${PORT}`);
});
