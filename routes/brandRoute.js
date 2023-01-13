const express = require("express");
const { createBrand, updateBrand, getBrand, getAllBrands, deleteBrand } = require("../controller/BrandCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);

router.put("/:id", authMiddleware, isAdmin, updateBrand);

router.get("/:id", authMiddleware, isAdmin, getBrand);

router.get("/", authMiddleware, isAdmin, getAllBrands);

router.delete("/:id", authMiddleware, isAdmin, deleteBrand);


module.exports = router;