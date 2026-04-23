const express= require("express")
const app=express()
const path=require("path");
const mongoose= require('mongoose');
const userRoute=require('./routes/user')

const PORT=8000

// connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/blogify')
        .then((e)=>{
            console.log("mongodb connected")
        })

app.set("view engine",'ejs')
app.set('views',path.resolve('./views'));

app.get('/',(req,res)=>{
    res.render("home");
})

app.use(express.urlencoded({extended:false}));
app.use('/user',userRoute)

app.listen(PORT,()=>{
    console.log(("Server listening on PORT 8000"));
})