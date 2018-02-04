var express     = require("express");
var router      = express.Router();
var Blog      = require("../models/blog.js");
var Comment     = require("../models/comments.js");
var passport    = require("passport");
var User        = require("../models/user.js");
router.get("/",function(req,res){
    //  Blog.find({},function(err,allblogs){
    // // allblogs=[{name:'deepanshu',title:'hey'}];
    //      res.render("home",{blogs:allblogs});
    //  });
    res.render("home");
    //res.render("home",{blogs:blogs});
});


//AUTH ROUTES
router.get("/register",function(req,res){
    res.render("register/register");
});
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register/register");
        }
        passport.authenticate("local")(req, res, function(){
            Blog.find({},function(err,allblogs){
                if(err)
                    console.log(err)
                else
                    res.render("blogs/index",{blogs:allblogs});
            });
        });
    });
});
router.get("/login",function(req,res){
    res.render("register/login");
});
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/blogs",
        failureRedirect:"/login"
    }),function(req,res){
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();}
    res.redirect("/login");
};
module.exports=router;