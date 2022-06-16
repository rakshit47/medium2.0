const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user")

//Creating Blog
router.post('/',verifyToken, async (req,res)=>{
    if (!req?.body?.title) throw { status: 404, message: "Title is required" };
    if (!req?.body?.body) throw { status: 404, message: "Body is required" };

    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        userId: req.userId
    });
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
})

//Gettin all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId");
    const blogArr = blogs.map((blog) => {
        const tempBlog = JSON.parse(JSON.stringify(blog));
        delete tempBlog.userId.password;
        return tempBlog;
    } )
    
    res.status(200).json(blogArr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting blogs by ID
router.get('/:id',findBlog, async (req,res)=>{
    // res.send(req.blog);
    try {
        const blog = await Blog.findById(req.params.id).populate("userId");
        const blog2 = JSON.parse(JSON.stringify(blog));
        delete blog2.userId.password;
        res.status(200).json(blog2);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

//Editing Blogs
router.patch('/:id',verifyToken,findBlog,async (req,res)=>{
    const myBlog = await Blog.findById(req.blog);
    try {
        if (myBlog.userId == req.userId) {
            // console.log(myBlog.userId);
            if (req.body.title != null) {
                await Blog.updateOne({},{title:req.body.title})   
            }
            if(req.body.body != null){
                await Blog.updateOne({},{body:req.body.body})
            }
            res.status(200).send(await Blog.findById(req.blog));
        } else {
            res.status(403).json({message: "You cannot edit this blog"})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Like API for blogs by ID stroing different users
router.patch('/like/:id',verifyToken,async (req,res)=>{
    const blog = await Blog.find({_id:req.params.id});
    console.log(blog)
    try{
            if(blog[0].likes.includes(req.userId)){
                await Blog.updateOne({_id:req.params.id},{$pull:{likes: req.userId}});
                await User.updateOne({_id:req.userId},{$pull:{myliked: req.params.id}})
                res.status(200).json({message: "UnLiked"})
            }else{
                await Blog.updateOne({_id:req.params.id},{$push:{likes: req.userId}});
                await User.updateOne({_id:req.userId},{$push:{myliked: req.params.id}})
                res.status(200).json({message: "Liked"})
            }
    }catch(err){
            res.status(404).json({message: err.message});
        }
})

//Deleting blogs by ID
router.delete('/:id',verifyToken,findBlog,async (req,res)=>{
    const myBlog = await Blog.findById(req.blog);
    try {
        if (myBlog.userId == req.userId) {
            await Blog.deleteOne({_id:myBlog._id})
            res.status(200).json({message : "Your Blog Delete !"});
        } else {
            res.status(200).json({message : "Cannot delete other's Blog"});
        }
    } catch (err) {
        res.status(500).json({message : err.messgae});
    }
    // res.status(200).json({message : "Done"});
})

async function findBlog(req,res,next) {
    let blog;
    try {
        blog = await Blog.findById(req.params.id)
        if(blog == null) {
        res.status(404).json({message: "Cannot find Blog"});
        }
    } catch (err) {
        res.status(500).json({message: err.message});   
    }
    req.blog = blog;
    next()
}

function verifyToken(req,res,next){
    const bearerheader = req.headers["authorization"];
    if(bearerheader){
        const bearerToken = bearerheader.split(" ")[1];
        jwt.verify(bearerToken, "secretkey", (err,authData)=>{
            if(err) res.sendStatus(403);
            else{
                // console.log(authData.id);
                req.userId = authData.id
            }
        })
        next()
    }
    else res.sendStatus(403);
}

module.exports = router;