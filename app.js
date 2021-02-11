require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require('lodash');
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("DB Connected");
});

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    date: String
});

const Post = mongoose.model("Post", postSchema);

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const date = new Date().toLocaleDateString("en-US", options);


app.get("/", (req, res) => {
    Post.find((err, posts) => {
        res.render("home", {posts: posts});
    });
});

app.route("/compose")

.get((req, res) => {
    res.render("compose");
})

.post((req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        date: date
    });
    newPost.save((err, post) => {
        if(err){
            res.send(err);
        } else{
            res.redirect("/");
        }
    });
});

app.get("/:postId", (req, res) => {
    Post.findOne({_id:req.params.postId}, (err, post) => {
        if(err){
            res.send("Post not found");
        } else{
            res.render("post", {post:post});
        }
    });
});

app.listen(PORT, () => {
    console.log("Server Started");
});