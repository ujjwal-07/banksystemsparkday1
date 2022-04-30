const mongoose = require('mongoose');
require("dotenv").config();
const express = require('express');
const app = express();
var path = require('path');
let alert = require("alert")
var bodyParser = require('body-parser');
var balanceOfUSer = 0;
var setbalance = 0;
var emaill = ''
var toemail = ''
var historyy = ''
var n =''

app.set("view engine", "ejs");

app.use(express.static('public'));
// app.use(express.static(__dirname + "/public"));



var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let bal = 0
var mongoDB = 'mongodb://127.0.0.1/customerdb';
mongoose.connect(mongoDB).then(()=>{
    console.log('db connected');
}).catch(err=>{
    console.log(err)
})

const uploadcustomerschema = new mongoose.Schema({
name : String,
email : String,
balance: Number,
history: String
})

const uploaddata = mongoose.model("userData", uploadcustomerschema
)


// GET API's


app.get('/AddCustomer',(req,res)=>{
    res.render("addCustomer");

})


app.get("/getCustomerData",  (req,res)=>{
    uploaddata.find({}, (err,data)=>{
        res.render('showUserData',{
            dataList : data
        })
    })
})



app.get("/updatebalance/:email",  (req,res)=>{
    let e = req.params.email;
    e = e.substring(0)
    uploaddata.find({email:e},(err,data)=>{
        if(data){
            balanceOfUSer = data[0].balance
            res.render('update',{
                dataList : data
            })
        
    
}
    
console.log(balanceOfUSer);

})
})



app.get("/do/",(req,res)=>{
    

uploaddata.find({email:emaill},(err,user)=>{
    if(user){
        historyy = user[0].history;
        historyy+= "Recieved "+setbalance+" from "+ toemail +" , \n";
        // console.log(user[0].balance)
        var myquery = { email: emaill };
        var newvalues = { $set: {balance: parseInt(user[0].balance)   + parseInt(setbalance),history:historyy} };
        uploaddata.updateOne(myquery,newvalues,(err,res)=>{
    if(err) throw err;
})
        
    
        

}
res.redirect("http://localhost:8080/getCustomerData");



})
});




app.get("/update/:to/:from/:amt",  (req,res)=>{
    setbalance = parseInt(req.params.amt);
    emaill = req.params.to

     
e = req.params.from;
uploaddata.find({email:e},(err,user)=>{
    if(user){
        toemail = user[0].email;
        historyy = user[0].history;
        historyy+= "Paid "+req.params.amt+" to "+ req.params.to +" , \n";
        var j = (parseInt(user[0].balance)  -  parseInt(req.params.amt))
        console.log(user)
        console.log(user[0].balance)
        var myquery = { email: e };
        var newvalues = { $set: {balance: parseInt(user[0].balance)   -  parseInt(req.params.amt),history:historyy  } };
        uploaddata.updateOne(myquery,newvalues,(err,res)=>{
    if(err) throw err;

})

res.redirect("http://localhost:8080/do/");


}


})









});



app.get("/updatebalance",  (req,res)=>{
    uploaddata.find({device : "Mobile"}, (err,data)=>{
        res.render('updateBalance',{
            dataList : data
        })
    })
})

app.get("/uu",  (req,res)=>{
    uploaddata.find({}, (err,data)=>{
        res.render('transfer',{
            dataList : data
        })
    })
})


// POST API's

app.post('/post' ,(req, res)=>{


    var blog = new uploaddata({
        name : req.body.name,
        email : req.body.email,
        balance : req.body.balance

    });
    uploaddata.findOne({email:req.body.email},(err,user)=>{
        if (user){
            alert("This Email has been already registered")
        }
        else{
        blog.save((err,doc)=>{
            if (err) throw err;
        });
        res.redirect("http://localhost:8080/getCustomerData");
    }
    
    })
  

})



app.post("/updatebalanceamount/:bal",(req,res)=>{
    res.send(req.params.bal);
})

const port = process.env.PORT || 8080;

app.listen(port, console.log(`Listening on port ${port}..`));