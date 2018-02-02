var  express            =   require("express"),
     app                =   express(),
    mongoose            =   require("mongoose"),
    passport            =   require("passport"),
    LocalStrategy       =   require("passport-local"),
    bodyParser          =   require("body-parser"),
    expressSanitizer    =   require("express-sanitizer"),
    methodOverride      =   require("method-override"),
    Blog                =   require("./models/blog"),
    Comment             =   require("./models/comments"),
    User                =   require("./models/user");
       //  seeddb=require("./seed");
//seeddb();
mongoose.connect("mongodb://localhost/bloggin_site");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
//Passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
   //  Blog.find({},function(err,allblogs){
   // // allblogs=[{name:'deepanshu',title:'hey'}];
   //      res.render("home",{blogs:allblogs});
   //  });
    res.render("home");
    //res.render("home",{blogs:blogs});
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,allblogs){
        // allblogs=[{name:'deepanshu',title:'hey'}];
        res.render("blogs/index",{blogs:allblogs});
    });
});
app.get("/blogs/new",function(req,res){
    res.render("blogs/new");
});
app.post("/blogs",function(req,res){
    //req.body.blog.body=req.sanitize(req.body.blog.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
   // newblog={name:req.body.name,title:req.body.title,body:req.body.body};
    Blog.create(req.body.blog,function(err,newblog){
       if(err)
           console.log(err);
       else{
           Blog.find({},function(err,allblogs){
               res.render("home",{blogs:allblogs});
           });

       }
    });
    //res.render("home");
});
app.get("/blogs/:id",function(req,res){
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
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
        console.log(err);
        else
        res.render("blogs/edit",{blog:blog});
    });
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
            console.log(err);
        else
            res.redirect("/")
    });
});
app.delete("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            blog.remove();
            res.redirect("/");

        }
    });
});
app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            console.log(err);
        else{
            res.render("comments/new",{blog:foundBlog});
        }
    });
});
app.post("/blogs/:id/comments",isLoggedIn,function(req,res){
        Blog.findById(req.params.id,function(err,blog){
            if(err)
                console.log(err);
            else{
                console.log(blog)
                console.log(blog.comments);
                Comment.create(req.body.comment,function(err,comment){
                    if(err){
                        console.log(err);
                        res.render("/");
                    }
                    else{
                        console.log(comment)
                        //blog.comments.push(obj);
                        blog.comments.push(comment)
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
//AUTH ROUTES
app.get("/register",function(req,res){
    res.render("register/register");
});
app.post("/register", function(req, res){
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
app.get("/login",function(req,res){
    res.render("register/login");
});
app.post("/login",passport.authenticate("local",
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
app.listen(8080,function(){
    console.log("app");
});
