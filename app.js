//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////request targeting a specific article///////
app.route("/articles")

.get(function(req,res) {
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }
 
  });
})

.post( function(req,res){



  const newArticle = new Article({

    title: req.body.title,
    content: req.body.content
  });
 
  newArticle.save(function(err){
    if(!err){
      res.send("Succes in posting an article");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the articles ");
    }else {
      res.send(err);
    }
  });

});

/////////////////request targeting a specific article///////

app.route("/articles/:articlesTitle")
.get(function(req,res){

  Article.findOne({title: req.params.articlesTitle} , function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article found");
    }
  
    
  });

})

.put(function(req,res){
  Article.updateOne(
    {title:req.params.articlesTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully updated");
      }else{
        res.send(err);
      }
    }
  );
})

.patch(function(req,res){
   Article.updateOne(
   {title:req.params.articlesTitle},
   {$set:req.body},
   function(err){
    if(!err){
      res.send("successfully updated the artcle");
    }else{
      res.send(err);
    }
   }
   );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articlesTitle},
    function(err){
      if(!err){
        res.send("successfully deleted the artcle");
      }else{
        res.send(err);
      }
     }
  );
});





























app.listen(3000, function() {
  console.log("Server started on port 3000");
});