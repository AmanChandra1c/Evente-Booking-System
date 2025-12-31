const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./Connection/connectDB.js");
const authRoutes = require("./Routes/user.Auth.js")
const eventRoutes = require("./Routes/event.js");
const bookingRoutes = require("./Routes/booking.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/event", eventRoutes);
app.use("/booking", bookingRoutes);

app.listen(process.env.PORT, () => {
    console.log("server is running");
    connectDB();
})