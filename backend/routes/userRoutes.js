const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const userFields =
  "id, fullname, email, phone, address, role, created_at";

// Lấy hồ sơ cá nhân
router.get("/profile", verifyToken, (req, res) => {
  const sql = `SELECT ${userFields} FROM users WHERE id = ?`;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get profile",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(results[0]);
  });
});

// Cập nhật hồ sơ cá nhân
router.put("/profile", verifyToken, (req, res) => {
  const { fullname, phone, address } = req.body;

  if (!fullname) {
    return res.status(400).json({
      message: "Fullname is required",
    });
  }

  const updateSql = `
    UPDATE users
    SET fullname = ?, phone = ?, address = ?
    WHERE id = ?
  `;

  db.query(
    updateSql,
    [fullname, phone || null, address || null, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Cannot update profile",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const selectSql = `SELECT ${userFields} FROM users WHERE id = ?`;

      db.query(selectSql, [req.user.id], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Cannot get updated profile",
            error: err.message,
          });
        }

        res.json(results[0]);
      });
    }
  );
});

// Đổi mật khẩu
router.put("/change-password", verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ mật khẩu",
    });
  }

  const selectSql = "SELECT password FROM users WHERE id = ?";

  db.query(selectSql, [req.user.id], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get user password",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const currentPassword = results[0].password || "";
    const isMatch = currentPassword.startsWith("$2")
      ? await bcrypt.compare(oldPassword, currentPassword)
      : oldPassword === currentPassword;

    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu cũ không đúng",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateSql = "UPDATE users SET password = ? WHERE id = ?";

    db.query(updateSql, [hashedPassword, req.user.id], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Cannot change password",
          error: err.message,
        });
      }

      res.json({
        message: "Đổi mật khẩu thành công",
      });
    });
  });
});

module.exports = router;
