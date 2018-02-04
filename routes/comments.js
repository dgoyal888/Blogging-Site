var express     = require("express");
var router      = express.Router();
var Blog       = require("../models/blog.js");
var Comment     = require("../models/comments.js");
router.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            console.log(err);
        else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});
router.post("/blogs/:id/comments",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
            console.log(err);
        else{
          //  console.log(blog)
           // console.log(blog.comments);
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                    res.render("/");
                }
                else{
                    //console.log(comment)
                   // console.log(req.user);
                    //blog.comments.push(obj);
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    Blog.findByIdAndUpdate(req.params.id,blog,function(err,updatedBlog){
                        if(err)
                            console.log(err);
                        else
                            res.redirect('/blogs/'+blog._id);
                    });
                }
            });
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();}
    res.redirect("/login");
};
module.exports=router;