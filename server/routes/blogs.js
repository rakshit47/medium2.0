const { response } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");

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

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userId");
    const blogArr = blogs.map((blog) => {
        const tempBlog = JSON.parse(JSON.stringify(blog));
        delete tempBlog.userId.password;
        return tempBlog;
        //  console.log(tempBlog)
    } )
    
    res.status(200).json(blogArr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id',findBlog, async (req,res)=>{
    res.send(res.blog);
})

router.patch('/like/:id',verifyToken,async (req,res)=>{
    const blog = await Blog.find({_id:req.params.id});
    try{
            if(blog[0].likes.includes(req.userId)){
                await Blog.updateOne({},{$pull:{likes: req.userId}});
                res.status(200).json({message: "UnLiked"})
            }else{
                await Blog.updateOne({},{$push:{likes: req.userId}});
                res.status(200).json({message: "Liked"})
            }
    }catch(err){
            res.status(404).json({message: err.message});
        }
})

async function findBlog(req,res,next) {
    let blog;
    try {
        blog = await Blog.findById(req.params.id)
        if(blog == null) {
            return res.status(404).json({message: "Cannot find Blog"});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});   
    }
    res.blog = blog;
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
    else rs.sendStatus(403);
}

module.exports = router;