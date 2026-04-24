const express= require("express")
const app=express()
const path=require("path");
const mongoose= require('mongoose');
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
const Blog=require('./models/blog');

const PORT=8000

// connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/blogify')
        .then((e)=>{
            console.log("mongodb connected")
        })

app.set("view engine",'ejs')
app.set('views',path.resolve('./views'));

app.use(cookieParser())
app.use(express.urlencoded({extended:false}));
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))

app.use((req,res,next)=>{
    res.locals.user=req.user;
    next();
});
app.use('/user',userRoute)
app.use('/blog',blogRoute);

app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({}).sort({ createdAt: -1 });
    res.render("home",{
        user:req.user,
        blogs:allBlogs
    });
})

app.listen(PORT,()=>{
    console.log(("Server listening on PORT 8000"));
})
