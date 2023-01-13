const express = require("express");
const { createCoupon, updateCoupon, getCoupon, getAllCoupons, deleteCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);

router.put("/:id", authMiddleware, isAdmin, updateCoupon);

router.get("/:id", authMiddleware, isAdmin, getCoupon);

router.get("/", authMiddleware, isAdmin, getAllCoupons);

router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);


module.exports = router;