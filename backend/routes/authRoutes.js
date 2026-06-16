const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkEmailSql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSql =
      "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(
      insertSql,
      [fullname, email, hashedPassword, "customer"],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Cannot register user",
            error: err.message,
          });
        }

        res.status(201).json({
          message: "Register successfully",
          userId: result.insertId,
        });
      }
    );
  });
});

// Đăng nhập
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email and password",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    let isMatch = false;

    // Nếu password trong DB đã hash bằng bcrypt
    if (user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Tạm hỗ trợ password dạng thường, vì lúc nãy ta insert admin là 123456
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successfully",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  });
});

module.exports = router;