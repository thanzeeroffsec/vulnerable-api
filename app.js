const express = require("express");
const userRouter = require("./router/v2/user/userRouter");
const adminV1Router = require("./router/v1/admin/adminRouter");
const userV1Router = require("./router/v1/user/userV1Router");
const adminV2Router = require("./router/v2/admin/adminRouter");
require("dotenv").config();
const winston = require("winston");

// Set up Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/server.log" }), // Log to file
  ],
});

const app = express();

// Middleware to log request and response details
app.use((req, res, next) => {
  const startTime = Date.now();

  // Capture response details
  const oldSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - startTime;

    // Log request and response details
    logger.info(`Request: ${req.method} ${req.url}`);
    logger.info(`Headers: ${JSON.stringify(req.headers)}`);
    logger.info(`Body: ${JSON.stringify(req.body)}`);
    logger.info(`Response Code: ${res.statusCode}`);
    logger.info(`Response Body: ${data}`);
    logger.info(`Response Time: ${responseTime}ms`);

    // Call the original send method
    oldSend.apply(res, arguments);
  };

  next();
});

// Middleware to log errors
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send("Internal Server Error");
});

app.use(express.json());

app.use("/api/v2/user", userRouter);
app.use("/api/v1/user", userV1Router);
app.use("/api/v2/admin", adminV2Router);
app.use("/api/v1/admin", adminV1Router);

app.get("/", (req, res) => {
  logger.info("Health check route accessed");
  return res.send("ok");
});

app.listen(5000, () => {
  logger.info("Server is listening on port 5000");
});
