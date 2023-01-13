const express = require("express");
const { createProduct, getAProduct, getAllProducts, updateProduct, deleteAProduct, addToWishlist, rating, uploadImages } = require("../controller/productCtrl");
const { uploadPhoto, productImgResize} = require("../middleware/uploadImages")
const router = express.Router();
const {isAdmin, authMiddleware} = require("../middleware/authMiddleware")



router.get("/", authMiddleware, getAllProducts);

router.get("/:id", authMiddleware, getAProduct);

router.put("/wishlist", authMiddleware, addToWishlist);

router.put("/rating", authMiddleware, rating);

router.post("/", authMiddleware, isAdmin,createProduct);

router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages)

router.put("/:id", authMiddleware, isAdmin,updateProduct)

router.delete("/:id", authMiddleware, isAdmin,deleteAProduct)

module.exports = router