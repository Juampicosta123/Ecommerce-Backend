const Category = require("../models/prodCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res ) => {
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch(e){
        throw new Error(e);
    }
});

const updateCategory = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedCategory);
    } catch(e){
        throw new Error(e);
    }
});

const deleteCategory = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch(e){
        throw new Error(e);
    }
});

const getCategory = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    } catch(e){
        throw new Error(e);
    }
});

const getAllCategories = asyncHandler(async (req, res ) => {
    try{
        const getCategories = await Category.find();
        res.json(getCategories);
    } catch(e){
        throw new Error(e);
    }
});
module.exports = {createCategory, updateCategory, deleteCategory, getCategory, getAllCategories};