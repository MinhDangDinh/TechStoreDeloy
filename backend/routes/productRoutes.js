const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads", "products");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

// Lấy tất cả sản phẩm
router.get("/", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get products",
        error: err.message,
      });
    }

    res.json(results);
  });
});

// Lấy chi tiết 1 sản phẩm
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM products WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get product detail",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(results[0]);
  });
});

// Admin thêm sản phẩm
router.post("/", verifyToken, isAdmin, upload.single("image"), (req, res) => {
  const { name, price, description, stock, category } = req.body;
  const image = req.file ? req.file.filename : req.body.image || null;

  if (!name || !price) {
    return res.status(400).json({
      message: "Product name and price are required",
    });
  }

  const sql = `
    INSERT INTO products (name, price, description, image, stock, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, price, description, image, stock, category],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Cannot create product",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Product created successfully",
        productId: result.insertId,
      });
    }
  );
});

// Admin sửa sản phẩm
router.put("/:id", verifyToken, isAdmin, upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category } = req.body;
  const image = req.file ? req.file.filename : req.body.image;

  const sql = `
    UPDATE products
    SET name = ?,
        price = ?,
        description = ?,
        image = COALESCE(?, image),
        stock = ?,
        category = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, price, description, image || null, stock, category, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Cannot update product",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    }
  );
});

// Admin xóa sản phẩm
router.delete("/:id", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot delete product",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  });
});

module.exports = router;
