require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const fileRoutes = require("./routes/fileRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to make the pool accessible to the routers
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.use("/upload", fileRoutes);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
