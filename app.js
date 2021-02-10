//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcrypt');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true});

const userSchema=new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User",userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password, 10, function(err, hash) {
      User.create({ email: req.body.username, password: hash}, function(err,doc){
        if(!err){
          //console.log(doc);
          //renderira se samo ako se uspješno logira
          res.render("secrets");
        } else{
          res.render(err);
        }
      });
  });
});

app.post("/login", function(req,res){
  User.findOne({email: req.body.username},function(err,doc){
    console.log(doc);
    if (err){
      res.render(err);
    } else{
      bcrypt.compare(req.body.password, doc.password, function(err, result) {
        if (result){
          res.render("secrets");
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
