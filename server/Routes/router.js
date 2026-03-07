const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Signup = require("../models/Signup");

// Create user
router.post("/create", async (req, res) => {
  const { name, email, age, gender, mobile, state, district, add, date } = req.body;

  if (!name || !email || !age || !gender || !mobile || !state || !district || !add || !date) {
    return res.status(422).json({ error: "Please fill all the data" });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(422).json({ error: "User with this email already exists" });
    }

    await User.create({ name, email, age, gender, mobile, state, district, add, date });
    return res.status(201).json(req.body);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/getusers", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ deletedRows: result });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get individual user
router.get("/induser/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json([user]);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Paginated users
router.get("/lmuser", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Search users
router.get("/searchusers/:query", async (req, res) => {
  const { query } = req.params;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await User.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
    });
    return res.status(200).json({ results: users });
  } catch (err) {
    console.error("Error searching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update user
router.patch("/updateuser/:id", async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      return res.status(201).json({ message: "User updated successfully" });
    }
    return res.status(422).json({ message: "error" });
  } catch (err) {
    return res.status(422).json({ message: "error" });
  }
});

// Signup
router.post("/signupadd", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(422).json({ error: "Please fill all the data" });
  }

  try {
    const existing = await Signup.findOne({ where: { email } });
    if (existing) {
      return res.status(422).json({ error: "User with this email already exists" });
    }

    await Signup.create({ name, email, mobile, password });
    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/loginpg", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ where: { email } });
    if (!user) {
      return res.json("Failed");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.json("Error");
  }
});

// Export CSV
router.get("/export-csv", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "date", "email", "age", "gender", "mobile", "state", "district", "add"],
    });

    const csvData = users.map((row) => Object.values(row.dataValues).join(",")).join("\n");

    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    return res.status(200).send(csvData);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).send("Error fetching data");
  }
});

module.exports = router;
