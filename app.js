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
var commentRoutes    = require("./routes/comments"),
    blogRoutes       = require("./routes/blogs"),
    indexRoutes      = require("./routes/index")
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

app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);
app.listen(8080,function(){
    console.log("app");
});
