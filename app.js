const express = require("express");
const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const generalLimiter = require("./utils/limiter");
const allowedOrigins = require("./config/corsConfig");
require("dotenv").config();
const helmet = require("helmet");
const app = express();
const cookieParser = require("cookie-parser");
const authenticateToken = require("./utils/authenticateToken");

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(generalLimiter);
app.use(
	cors({
		origin: allowedOrigins,
		// origin: "*",
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(authenticateToken);
app.use(errorHandler);

module.exports = app;
