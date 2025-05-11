const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "*", // Use specific origins in production
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

const sequelize = new Sequelize('db_ab8cba_bosun', 'db_ab8cba_bosun_admin', '2004Bos16..', {
  host: 'SQL6030.site4now.net',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,              // required for Azure-hosted SQL Server
      trustServerCertificate: true,
    },
  },
  logging: false, // Optional: disables SQL query logging
});  
// Test DB connection
sequelize.authenticate()
  .then(() => console.log("MySQL DB connected"))
  .catch(err => console.error("DB connection error:", err));

// Define Login model
const Login = sequelize.define("Login", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: "Logins",
});

// Sync models
sequelize.sync()
  .then(() => console.log("Models synced"))
  .catch(err => console.error("Model sync error:", err));

// Routes
app.get("/api/logins", async (req, res) => {
  try {
    const logins = await Login.findAll({
      attributes: ['username', 'code'] // Don't expose passwords
    });
    res.json(logins);
  } catch (err) {
    console.error("Error fetching logins:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/logins", async (req, res) => {
  const { username, password, code } = req.body;

  try {
    await Login.create({ username, password, code });
    res.status(201).json({ message: "Login added successfully." });
  } catch (err) {
    console.error("Error adding login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
