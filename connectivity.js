const mongoose = require('mongoose');
require("dotenv").config();
const express = require('express');
const app = express();
const multer = require('multer');
var path = require('path');
const { strictEqual } = require('assert');

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });


app.set("view engine", "ejs");

app.use(express.static('public'));
// app.use(express.static(__dirname + "/public"));



var router = express.Router();


var mongoDB = 'mongodb://127.0.0.1/wallpaperdb';
mongoose.connect(mongoDB).then(()=>{
    console.log('db connected');
}).catch(err=>{
    console.log(err)
})

const uploadWallpaperschema = new mongoose.Schema({
device : String,
wallpaper : String,
image: String
})

const wallpapermodel = mongoose.model("model", uploadWallpaperschema)

const storage = multer.diskStorage({
    destination:"./public/upload/",
    

    filename: function(request, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

app.get('/hii',(req,res)=>{
    res.render("mean");

})

app.post('/post', upload.single('file') ,(req, res)=>{
    var imageFile = req.file.filename;
    var success = req.file.fieldname+ "uploaded succesfully";

    var blog = new wallpapermodel({
        device : req.body.device,
        wallpaper : req.body.wallpaper,
        image : imageFile

    });
    blog.save((err,doc)=>{
        if (err) throw err;
    });
    res.redirect("http://localhost:8080/hii");

})


app.get("/getData",  (req,res)=>{
    wallpapermodel.find({device : "PC"}, (err,data)=>{
        res.render('wallpaper',{
            dataList : data
        })
    })
})


app.get("/getDataForDark",  (req,res)=>{
    wallpapermodel.find({wallpaper : "Dark Wallpaper"}, (err,data)=>{
        res.render('wallpaper',{
            dataList : data
        })
    })
})

app.get("/getDataForSports",  (req,res)=>{
    wallpapermodel.find({wallpaper : "Sports"}, (err,data)=>{
        res.render('wallpaper',{
            dataList : data
        })
    })
})

app.get("/getDataForNature",  (req,res)=>{
    wallpapermodel.find({wallpaper : "Nature"}, (err,data)=>{
        res.render('wallpaper',{
            dataList : data
        })
    })
})

app.get("/getDataForMobile",  (req,res)=>{
    wallpapermodel.find({device : "Mobile"}, (err,data)=>{
        res.render('wallpaperMobile',{
            dataList : data
        })
    })
})

app.get("/getDataForMobileDark",  (req,res)=>{
    wallpapermodel.find({ $and: [{device:"Mobile"},{wallpaper : "Dark Wallpaper"}]}, (err,data)=>{
        res.render('wallpaperMobile',{
            dataList : data
        })
    })
})
app.get("/getDataForMobileSports",  (req,res)=>{
    wallpapermodel.find({ $and: [{device:"Mobile"},{wallpaper : "Sports"}]}, (err,data)=>{
        res.render('wallpaperMobile',{
            dataList : data
        })
    })
})
app.get("/getDataForMobileNature",  (req,res)=>{
    wallpapermodel.find({ $and: [{device:"Mobile"},{wallpaper : "Nature"}]}, (err,data)=>{
        res.render('wallpaperMobile',{
            dataList : data
        })
    })
})
const port = process.env.PORT || 31173;

app.listen(port, console.log(`Listening on port ${port}..`));