const mongoose = require('mongoose');
require("dotenv").config();
const express = require('express');
const { Db } = require('mongodb');
const app = express();

var mongoDB = 'mongodb://127.0.0.1/wallpaperdb';
mongoose.connect(mongoDB).then(()=>{
    console.log('db connected');
}).catch(err=>{
    console.log(err)
})

const port = process.env.PORT || 8080;

app.listen(port, console.log(`Listening on port ${port}..`));