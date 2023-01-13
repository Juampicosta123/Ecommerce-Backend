const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch(e){
        throw new Error(e);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const udpateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
        res.json(udpateBlog)
    } catch(e){
        throw new Error(e);
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(
            id, 
            {
            $inc:{numViews:1}
            },
            {new:true
            }
        );
        res.json(getBlog)
    } catch(e){
        throw new Error(e);
    }
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs)
    } catch(e){
        throw new Error(e);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog)
    } catch(e){
        throw new Error(e);
    }
});

const likeBlog = asyncHandler(async (req, res) => {
   const {blogId} = req.body;
   validateMongoDbId(blogId);
   
   //FIND THE BLOG 
   const blog = await Blog.findById(blogId);
   //FIND LOGIN USER
   const loginUserId = req?.user?._id;
   //FIND IF THE USER HAS LIKED THE BLOG
   const isLiked =  blog?.isLiked;
    //FIND IF THE USER DISLIKED THE BLOG
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
        );
        if(alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: {dislikes : loginUserId},
                isDisliked: false,
            },
            {new: true}
        );
        res.json(blog);
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: {likes : loginUserId},
                isLiked: false,
            },
            {new: true}
        );
        res.json(blog);
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: {likes : loginUserId},
                isLiked: true,
            },
            {new: true}
        );
        res.json(blog);
        }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId);
    
    //FIND THE BLOG 
    const blog = await Blog.findById(blogId);
    //FIND LOGIN USER
    const loginUserId = req?.user?._id;
    //FIND IF THE USER HAS LIKED THE BLOG
    const isDisliked =  blog?.isDisliked;
     //FIND IF THE USER DISLIKED THE BLOG
     const alreadyLiked = blog?.likes?.find(
         (userId) => userId?.toString() === loginUserId?.toString()
         );
         if(alreadyLiked){
             const blog = await Blog.findByIdAndUpdate(blogId, {
                 $pull: {likes : loginUserId},
                 isLiked: false,
             },
             {new: true}
         );
         res.json(blog);
         }
         if(isDisliked){
             const blog = await Blog.findByIdAndUpdate(blogId, {
                 $pull: {dislikes : loginUserId},
                 isDisliked: false,
             },
             {new: true}
         );
         res.json(blog);
         } else {
             const blog = await Blog.findByIdAndUpdate(blogId, {
                 $push: {dislikes : loginUserId},
                 isDisliked: true,
             },
             {new: true}
         );
         res.json(blog);
         }
 });
 
 const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const uploader = path => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id, 
            {
            images: urls.map(file => {
                return file
            }, 
            {
                new: true,
            }), 
        }
        )
        res.json(findBlog)
    } catch(e){
        throw new Error(e);
    }
});
module.exports = {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages}