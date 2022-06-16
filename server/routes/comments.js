const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user")
const Comment = require("../models/comment");

router.get('/',async (req,res)=>{
    const comments = await Comment.find()
    res.send(comments);
})

router.get('/:id',getComment,(req,res)=>{
    res.send(req.comment);
})

router.post('/:id',getBlog,verifyToken,async (req,res)=>{
    if(!req?.body?.comment) throw {status: 404, message: "Empty Comment !"}
    const obj = new Comment({
        comment: req.body.comment,
        blogId: req.params.id,
        userId: req.userId
    });
    const newComment = await obj.save();
    res.status(201).json(newComment);
    
})

router.patch('/:id',getComment,verifyToken,async(req,res)=>{
    try{
        if(req.comment.userId == req.userId){
            await Comment.findByIdAndUpdate(req.params.id,{comment: req.body.comment})
            res.status(200).json({message: "Comment Updated!"});
        }
        else res.status(403).json({message: "Cannot edit others blog"})
    }catch(err){
        res.status(500).json({message: err.message })
    }
})

router.delete('/:id',getComment,verifyToken,async(req,res)=>{
    try{
        if(req.comment.userId == req.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json({message: "Your Comment got Deleted!"});
        }
        else res.status(403).json({message: "Cannot delete others blog"})
    }catch(err){
        res.status(500).json({message: err.message })
    }
})

function verifyToken(req,res,next){
    const bearerHeader = req.headers["authorization"];
    if(bearerHeader){
        const bearerToken = bearerHeader.split(" ")[1];
        jwt.verify(bearerToken,"secretkey",(err,authData)=>{
            if(err) res.sendStatus(403);
            else{
                req.userId = authData.id
            }
        })
        next();
    }
    else res.sendStatus(403);
}
async function getComment(req,res,next){
    let comment;
    try{
        comment = await Comment.findById(req.params.id)
        if(comment == null ){
            res.status(404).json({message: "Cannot find this comment"})
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }
    req.comment = comment;
    next();
}
async function getBlog(req,res,next){
    let blog;
    try{
        blog = await Blog.findById(req.params.id);
        if(blog == null){
            res.status(404).json({message: "Cannot find the blog !"});
        }
        
    }catch(err){
        res.send(500).json({message: err.message})
    }
    req.blog = blog;
    next();
}

module.exports = router;