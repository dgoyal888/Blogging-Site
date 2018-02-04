
var express     = require("express");
var router      = express.Router();
var Blog       = require("../models/blog.js");
var Comment     = require("../models/comments.js");
router.get("/blogs",function(req,res){
    Blog.find({},function(err,allblogs){
        // allblogs=[{name:'deepanshu',title:'hey'}];
        res.render("blogs/index",{blogs:allblogs});
    });
});
router.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("blogs/new");
});
router.post("/blogs",isLoggedIn,function(req,res){
    //req.body.blog.body=req.sanitize(req.body.blog.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // newblog={name:req.body.name,title:req.body.title,body:req.body.body};
    Blog.create(req.body.blog,function(err,newblog){
        if(err)
            console.log(err);
        else{
            newblog.name.username=req.user.username;
            newblog.name.id=req.user._id;
            newblog.save();
            Blog.find({},function(err,allblogs){
                res.render("home",{blogs:allblogs});
            });

        }
    });
    //res.render("home");
});
router.get("/blogs/:id",function(req,res){
    /*Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            console.log(err);
        else
            res.render("show",{blog:foundBlog});
    });*/
    Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
        if(err)
            console.log(err);
        else{
            console.log(foundBlog);
            console.log(foundBlog.comments)
            res.render("blogs/show",{blog:foundBlog});}
    });
});
router.get("/blogs/:id/edit",checkBlogOwnership,function(req,res){
        Blog.findById(req.params.id,function(err,blog){
            if(err)
                console.log(err);
            else
                    res.render("blogs/edit",{blog:blog});
        });
});
router.put("/blogs/:id",checkBlogOwnership,function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
            console.log(err);
        else
            res.redirect("/")
    });
});
router.delete("/blogs/:id",checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");

        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();}
    res.redirect("/login");
};
function checkBlogOwnership(req,res,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id,function(err,blog){
            if(err)
                res.redirect("back");
            else{
                if(blog.name.id.equals(req.user._id))
                    next();
                    //res.render("blogs/edit",{blog:blog});
                else
                    res.redirect("back");
                    //res.redirect("/blogs/"+ req.params.id);
            }

        });
    }else {
        res.redirect("/login");
    }
};
module.exports=router;