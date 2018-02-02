var mongoose=require("mongoose");
var Blog=require("./models/user");
var Comment=require("./models/comments");
data=[
    {name:"Deepanshu",title:"testing",body:"fdgdfffffffffffffffffffffffffffff"},
    {name:"sunny",title:"testing",body:"dsssssssssssssssssssssssss"}
];
function seeddb() {
    Blog.remove({}, function (err) {
        if (err)
            console.log(err);
        else {
            data.forEach(function(seed){
                Blog.create(seed,function(err,blog){
                    if(err)
                        console.log(err);
                    else{
                        console.log("blog created");
                        Comment.create({text:"hi",author:"sunny"},function(err,comment){
                            if(err)
                                console.log(err);
                            else {
                                blog.comments.push(comment);
                                blog.save();
                            }
                        });
                    }

                });
            });
        }

    });
}
module.exports=seeddb;