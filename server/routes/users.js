const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

//Getting all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Getting One
router.get("/:id", getUser, async (req, res) => {
  res.send(res.user);
});

//Creating One
router.post("/signup", async (req, res) => {
  try {
    if (!req?.body?.name) throw { status: 404, message: "Name is required" };
    if (!req?.body?.email) throw { status: 404, message: "Email is required" };
    if (!req?.body?.password) throw { status: 404, message: "Password is required" };
    if ((await User.countDocuments({ email: req.body.email })) == 0) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
      });
      const newUser = await user.save();
      const obj = {
        name: newUser.name,
        email: newUser.email,
        id: newUser._id,
        theme: newUser.theme,
      };
      const token = jwt.sign(obj, "secretkey");
      res.status(201).json({
        token,
      });
    } else {
      throw { message: "Email already exists" };
    }
    // res.send(users);
  } catch (err) {
    res.status(err?.status || 400).json({ message: err.message });
  }
});

//Login
router.post("/login", async (req, res) => {
    try {
      if (!req?.body?.email) throw { status: 404, message: "Email is required" };
      if (!req?.body?.password) throw { status: 404, message: "Password is required" };
      const oldUser = await User.findOne({ email: req.body.email })
      
      if ( !!oldUser ) {
        if (!bcrypt.compareSync(req.body.password,oldUser.password)) 
        {
            throw { message: "Wrong Password !" };
        }
        const obj = {
          name: oldUser.name,
          email: oldUser.email,
          id: oldUser._id,
          theme: oldUser.theme,
        };
        const token = jwt.sign(obj, "secretkey");
        res.status(201).json({
          token,
        });
      } else {
        throw { message: "Email doesn't exists" };
      }
    } catch (err) {
      res.status(err?.status || 400).json({ message: err.message });
    }
  });


//Updating One
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.theme != null) {
    res.user.theme = req.body.theme;
  }
  try {
    const updatedSub = await res.user.save();
    res.json(updatedSub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete("/:id",getUser, async (req, res) => {
  const userId = req.user;
  try {
    await User.deleteOne({_id: userId});
    await Blog.deleteMany({userId})
    res.status(200).json({message: "User Deleted"})
  } catch (error) {
    res.status(400).json({message: error})
    
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
       res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// async function getblog(req,res,next){
//   let blog;
//   try{
//     blog = await Blog.find()
//   }
// }

// function verifyToken(req, res, next) {
//   const bearerheader = req.headers["authorization"];
//   if (bearerheader) {
//     // console.log(bearerheader);
//     const bearerToken = bearerheader.split(" ")[1];
//     jwt.verify(bearerToken, "secretkey", (err, authData) => {
//       if (err) {
//         res.sendStatus(403);
//       } else {
//         req.userId = authData.user.id;
//         req.userEmail = authData.user.email;
//       }
//     });
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// }

module.exports = router;
