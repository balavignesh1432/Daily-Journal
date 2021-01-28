//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require('mongoose');
// mongoose.connect("mongodb://localhost:27017/diaryDB",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://admin-RBV:Test123@cluster0.wqffl.mongodb.net/diaryDB",{useNewUrlParser:true,useUnifiedTopology: true});
const DiarySchema=new mongoose.Schema(
  {
    title: String,
    content:String
  }
);

const Diary = mongoose.model('Diary',DiarySchema);

const homeStartingContent = "This is a Daily Journal created to keep track of my path of becoming a Full Stack Web Developer.";
const contactContent = "Email:balavignesh1432@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Diary.find({},function(err,foundEntries){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundEntries
        });
    }
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Diary({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;
  Diary.findOne({_id:requestedId},function(err,foundEntries){
        res.render("post", {
          title: foundEntries.title,
          content: foundEntries.content
        });
      });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server Up Successful");
});
