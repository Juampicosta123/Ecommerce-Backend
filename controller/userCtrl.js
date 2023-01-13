const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt");
const validateMongoDbId = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { updateOne } = require("../models/userModel");

const createUser = asyncHandler(async (req,res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser) {
        // Create User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User alreasy exists
        throw new Error("User Already Exists");
    }


});

const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // check if user exists
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id)
        const udpateuser = await User.findOneAndUpdate(
            findUser.id, 
            {
            refreshToken : refreshToken,
            },
            {
                new: true,
            }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge:72* 60* 60* 1000,
        })
        res.json({
            _id: findUser?._id,
            fistname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});
//admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const admin = false;
    const {email, password} = req.body;
    // check if user exists
    const findAdmin = await User.findOne({email});
    if(findAdmin.role != "admin"){
        throw new Error("Not authorized")
    }
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const udpateuser = await User.findOneAndUpdate(
            findAdmin.id, 
            {
            refreshToken : refreshToken,
            },
            {
                new: true,
            }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge:72* 60* 60* 1000,
        })
        res.json({
            _id: findAdmin?._id,
            fistname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//Get all users
const getAllUsers = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find()
        res.json(getUsers);
    } catch(e){
        throw new Error(e)
    }
})

//Get a user

const getAUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(_id);
    try{
        const getUser = await User.findById(id)
        res.json({getUser});
    } catch(e){
        throw new Error(e)
    }
})

//Delete
const deleteAUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    } catch(e){
        throw new Error(e)
    }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No refresh token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(User?._id);
        res.json({accessToken});
    }) 
});

//logout 

const logout = asyncHandler( async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure: true,
    });
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.sendStatus(204); 
});

//Update 

const updateAUser = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            },
            {
            new: true,
            }
        );
        res.json(updatedUser);
    } catch(e){
        throw new Error(e)
    }
});

//save user address
const saveAddress = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            {
            address: req?.body?.address,
            },
            {
            new: true,
            }
        );
        res.json(updatedUser);
    } catch(e){
        throw new Error(e)
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
        id, 
        {
            isBlocked: true
        },
        {
            new: true
        }
        )
        res.json(block)
    } catch(e){
        throw new Error(e)
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },
        {
            new: true
        }
        )
        res.json(unblock)
    } catch(e){
        throw new Error(e)
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const{_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    } else {
        res.json(user)
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error("User not found with this email");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http:localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL
        };
        sendEmail(data);
        res.json(token);
    }   catch(e){
        throw new Error(e);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt: Date.now()},
    });
    if(!user) throw new Error("Token expired, please try again later");
    User.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    try{
        const findUser = await User.findById(_id).populate("wishList");
        res.json(findUser)
    } catch(e) {
        throw new Error(e);
    }
});

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const lenght = Object.keys(req.body.cart).length
    try{
        let products = [];
        const user = await User.findById(_id);
        //check if user already have products in cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for (let i = 0; i < lenght; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0 ; i < products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch(e){
        throw new Error(e)
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        res.json(cart);
    } catch(e){
        throw new Error(e);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby: user._id});
        res.json(cart);
    } catch(e){
        throw new Error(e);
    }
});

const applyCoupon = asyncHandler (async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    const {coupon} = req.body;
    const validCoupon = await Coupon.findOne({name: coupon});
    if(validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({_id});
    let {products, cartTotal} = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) /100).toFixed(2);
    await Cart.findOneAndUpdate({
        orderby: user._id}, 
        {totalAfterDiscount}, 
        {new:true}
    );
    res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
    const {COD, couponApplied} = req.body;
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        if(!COD) throw new Error("Create cash order failed");
        const user = await User.findById({_id});
        let userCart = await Cart.findOne({orderby: user._id});
        let finalAmount = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status:"Cash on Delivery",
                created: Date.now(),
                currency:"pesos"
            },
            orderby: user._id,
            orderStatus: "Cash on delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count, sold: +item.count}}
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({message: "success"})
    } catch(e){
        throw new Error(e);
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const userorders = await Order.find({orderby: _id}).populate("products.product").exec();
        res.json(userorders);
    } catch(e){
        throw new Error(e);
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const {status} = req.body;
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateOrder = await Order.findByIdAndUpdate(
            id, 
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                }
            }, 
            {new:true}
        );
        res.json(updateOrder)
    } catch(e){
        throw new Error(e);
    }
})

module.exports = {
    createUser, 
    loginUserCtrl, 
    loginAdmin, 
    getAllUsers, 
    getAUser, 
    deleteAUser, 
    updateAUser,
    blockUser, unblockUser, 
    handleRefreshToken,
    logout, 
    updatePassword, forgotPasswordToken, resetPassword, 
    getWishlist, 
    saveAddress,
    userCart, getUserCart, emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    }