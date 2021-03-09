//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view-engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

//Chained Route Handlers using Express
//////////////////////////////////////// Requests targeting all articles ////////////////////////////////////////
app.route("/articles")

   .get(function(req,res) {
     Article.find(function(err,foundArticles) {
       if(err)
          res.send(err);
       else
          res.send(foundArticles);
     });
   })

   .post(function(req,res) {
     const articleName = req.body.title;
     const articleContent = req.body.content;
     // console.log(articleName);
     // console.log(articleContent);
     const newArticle = new Article ({
       title: articleName,
       content: articleContent
     })
     newArticle.save(function(err) {
       if(err)
          res.send(err);
       else
          res.send("Successfully added a new article.");
     });
    })

    .delete(function(req,res) {
      Article.deleteMany(function(err) {
        if(err)
           res.send(err);
        else
           res.send("Successfully deleted all articles.");
      });
    });

//////////////////////////////////////// Requests targeting a specific article ////////////////////////////////////////

app.route("/articles/:articleTitle")

   .get(function(req,res) {
     const articleRequested = req.params.articleTitle;

     Article.findOne({title: articleRequested}, function(err, foundArticle) {
       if(err)
           res.send(err);
       else
           res.send(foundArticle);
     });
   })

   .put(function(req,res) {
     Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {
          if(!err)
             res.send("Successfully updated the article.");
        }
     );
   })

   .patch(function(req,res) {
     // req.body = {
     //   title: "TEST",
     //   content: "TEST"
     // };
     //No need to set overwrite property to true here because you are only updating a particular property of an article.
     Article.update(
       {title: req.params.articleTitle},
       {$set: req.body},
       function(err){
         if(!err)
            res.send("Successfully updated the selected article.");
         else
            res.send(err);
       }
     );
   })

   .delete(function(req,res) {
     Article.deleteOne(
       {title: req.params.articleTitle},
       function(err) {
         if(!err)
            res.send("Successfully deleted the selected article.");
         else
            res.send(err);
       }
     );
   });
// app.get("/articles", );
// app.post("/articles", );
// app.delete("/articles", );

app.listen(3000, function() {
  console.log("Server started running on port 3000.");
});
