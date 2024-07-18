const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);


/////////////////////////////////////REQUEST TARGETTING ALL METHODS////////////////////////////////////

app.route("/articles")
    .get(function (req, res) {
        Article.find()
            .then(function (found) {
                res.send(found);
            })
            .catch(function (err) {
                console.log(err)
            })
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save()
            .then(function () {
                res.send("Successfully added a new article");
            })
            .catch(function (err) {
                res.send(err);
            });
    })
    .delete(function (req, res) {
        Article.deleteMany({})
            .then(function () {
                res.send("Successfully deleted all articles");
            })
            .catch(function (err) {
                res.send(err);
            });
    });

    /////////////////////////////////////REQUEST TARGETTING A SPECIFIC METHODS////////////////////////////////////
    app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({title: req.params.articleTitle})
        .then(function (found) {
            res.send(found);
            if(!found){
                res.send("No article with that title was found");
            }
        })
        .catch(function(err){
            res.send(err);
        });
    })
    .put(function(req,res){
        Article.findOneAndUpdate({
            title:req.params.articleTitle
        },
        {
            title:req.body.title,
            content:req.body.content
        },
        {overwrite:true}
    )
    .then(function(err){
        if(!err){
            res.send("Successfully updated the article");
        }
        else{
            res.send(err);
        }
    })
    })
    .patch(function(req,res){
        Article.findOneAndUpdate(
        {title:req.params.articleTitle },
        {$set:req.body}
    )
    .then(function(){
        res.send("Successfully updated the article");
    })
    .catch(function(err){
        res.send(err);
    })
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle})
    .then(function(){
        res.send("Successfully deleted the article");
    })
    .catch(function(err){
        res.send("No article with that title was found");
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});