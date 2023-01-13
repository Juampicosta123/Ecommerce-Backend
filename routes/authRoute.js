const express = require("express");
const router = express.Router();
const {createUser, loginUserCtrl, getAllUsers, getAUser, deleteAUser, updateAUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middleware/authMiddleware");



router.post("/register", createUser);

router.post("/forgot-password-token", forgotPasswordToken)

router.put("/reset-password/:token", resetPassword)

router.post("/cart", authMiddleware,userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);

router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/cart/get-orders", authMiddleware, getOrders);
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);


router.get("/getUsers", authMiddleware,getAllUsers);

router.get("/refresh", handleRefreshToken);

router.get("/logout", logout);

router.get("/wishlist", authMiddleware, getWishlist);

router.get("/:id", authMiddleware, isAdmin,getAUser);

router.delete("/:id", authMiddleware,deleteAUser);

router.put("/edit-user", authMiddleware,updateAUser);

router.put("/save-address", authMiddleware,saveAddress);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);

router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);



module.exports = router;