const Blog = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBlog = asyncHandler(async (req, res ) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch(e){
        throw new Error(e);
    }
});

const updateBlog = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBlog);
    } catch(e){
        throw new Error(e);
    }
});

const deleteBlog = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch(e){
        throw new Error(e);
    }
});

const getBlog = asyncHandler(async (req, res ) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id);
        res.json(getBlog);
    } catch(e){
        throw new Error(e);
    }
});

const getAllBlogs = asyncHandler(async (req, res ) => {
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch(e){
        throw new Error(e);
    }
});
module.exports = {createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs};