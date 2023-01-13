const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res ) => {
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch(e){
        throw new Error(e);
    }
});

const updateBrand = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBrand);
    } catch(e){
        throw new Error(e);
    }
});

const deleteBrand = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch(e){
        throw new Error(e);
    }
});

const getBrand = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    } catch(e){
        throw new Error(e);
    }
});

const getAllBrands = asyncHandler(async (req, res ) => {
    try{
        const getBrands = await Brand.find();
        res.json(getBrands);
    } catch(e){
        throw new Error(e);
    }
});
module.exports = {createBrand, updateBrand, deleteBrand, getBrand, getAllBrands};