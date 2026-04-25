require("dotenv").config();
const express= require("express")
const app=express()
const path=require("path");
const mongoose= require('mongoose');
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
const Blog=require('./models/blog');

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("MONGO_URL is required. Set it in environment variables.");
}

// connect mongoose
mongoose.connect(MONGO_URL)
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
    console.log((`Server listening on PORT ${PORT}`));
})
