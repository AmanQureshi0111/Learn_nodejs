const path=require("path")
const express=require("express")
const multer= require("multer");

const app=express()
const PORT=8000

const storage=multer.diskStorage({
    destination: function (req,file,cb){
        return cb(null,'./uploads');
    },
    filename: function (req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
})

const upload=multer({storage:storage});

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    return res.render("homepage")
})

app.post('/upload',upload.single('profileImage'),(req,res)=>{
    console.log(req.body)
    console.log(req.file)
})

app.listen(PORT,()=>{
    console.log('Server listening on port 8000');
})