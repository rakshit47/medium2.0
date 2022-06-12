const express = require('express');
const app = express();
// const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = require('./url.js');

// app.use(bodyparser.json());

const clint = new MongoClient(url);

MongoClient.connect(url,(err,db)=>{
    if (err) throw err;
    console.log('DataBase Paired!');
    db.close();
})

app.get((res,req)=>{

})