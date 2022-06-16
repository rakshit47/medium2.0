//env configaetion
require('dotenv').config();

const express = require("express");
const app = express();
const Mongoose = require("mongoose");

//connecting to the database 
Mongoose.connect(process.env.DATA_URL);
const db = Mongoose.connection;

db.on('error',(error)=>console.error(error));
db.once('open',()=>console.log('Database Connected'));

//Getting all the response in JSON object format
app.use(express.json());

const userRouter = require('./routes/users')
app.use('/api/user',userRouter);

const blogRouter = require('./routes/blogs')
app.use('/api/blog',blogRouter);

const commentRouter = require('./routes/comments');
app.use('/api/comment',commentRouter);

app.listen(8000,()=>{
    console.log("Server Started");
});