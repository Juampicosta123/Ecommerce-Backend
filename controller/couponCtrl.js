const Coupon = require("../models/couponModel")
const validateMongoDbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch(e){
        throw new Error(e);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const id = req.params;
    validateMongoDbId(id);
    try{
        const updateCoupon = await Coupon.findOneAndUpdate({id}, req.body, {new:true})
        res.json(updateCoupon);
    } catch(e){
        throw new Error(e);
    }
});

const deleteCoupon = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    } catch(e){
        throw new Error(e);
    }
});

const getCoupon = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getCoupon = await Coupon.findById(id);
        res.json(getCoupon);
    } catch(e){
        throw new Error(e);
    }
});

const getAllCoupons = asyncHandler(async (req, res ) => {
    try{
        const getCoupons = await Coupon.find();
        res.json(getCoupons);
    } catch(e){
        throw new Error(e);
    }
});
module.exports = {createCoupon, updateCoupon, deleteCoupon, getAllCoupons, getCoupon};