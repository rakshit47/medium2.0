// require('dotenv').config();

const express = require("express");
const app = express();
const Mongoose = require("mongoose");

Mongoose.connect('mongodb://localhost/subs');
// const db = Mongoose.connection;
// db.on('error',(error)=>console.error(error));
// db.once('open',()=>console.log('Server Started'));


app.listen(8000,()=>{
    console.log("Server Started");
});