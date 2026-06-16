const express = require("express");
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer tạo đơn hàng
router.post("/", verifyToken, (req, res) => {
  const userId = req.user.id;
  const {
    items,
    receiver_name,
    receiver_phone,
    shipping_address,
    shipping_method,
    payment_method,
    note,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Cart is empty",
    });
  }

  let totalAmount = 0;

  items.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  const orderSql = `
    INSERT INTO orders (
      user_id,
      total_amount,
      status,
      receiver_name,
      receiver_phone,
      shipping_address,
      shipping_method,
      payment_method,
      note
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderSql,
    [
      userId,
      totalAmount,
      "pending",
      receiver_name || null,
      receiver_phone || null,
      shipping_address || null,
      shipping_method || null,
      payment_method || null,
      note || null,
    ],
    (err, orderResult) => {
      if (err) {
        return res.status(500).json({
          message: "Cannot create order",
          error: err.message,
        });
      }

      const orderId = orderResult.insertId;

      const orderItems = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      const orderItemSql =
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";

      db.query(orderItemSql, [orderItems], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Cannot create order items",
            error: err.message,
          });
        }

        res.status(201).json({
          message: "Order created successfully",
          orderId: orderId,
          totalAmount: totalAmount,
        });
      });
    }
  );
});

// Customer xem đơn hàng của mình
router.get("/my-orders", verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get my orders",
        error: err.message,
      });
    }

    res.json(results);
  });
});

// Admin xem tất cả đơn hàng
router.get("/", verifyToken, isAdmin, (req, res) => {
  const sql = `
    SELECT orders.*, users.fullname, users.email
    FROM orders
    JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot get orders",
        error: err.message,
      });
    }

    res.json(results);
  });
});

// Admin cập nhật trạng thái đơn hàng
router.put("/:id/status", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "confirmed",
    "shipping",
    "completed",
    "cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Cannot update order status",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
    });
  });
});

module.exports = router;
