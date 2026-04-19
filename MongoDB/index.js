const express   = require("express");
const app       = express();
const port      = 8000;
const mongoose  =require("mongoose");

//using mongoose
//we first define schema
//Schema - define the structure 
//Schema - model
// using model we do crud operation

//Schema

const userSchema    = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    gender:{
        type:String,
    },
    jobTitle:{
        type:String,
    }
},{timestamps:true})

//Connection
mongoose.connect('mongodb://127.0.0.1:27017/my_db')
        .then(()=> console.log("MongoDB connected"))
        .catch((err)=> console.log("Mongo Error",err));
    
//Model
const User  = mongoose.model("user",userSchema);

//middle-ware plugin
app.use(express.urlencoded(({extented:false})));
app.use(express.json());

//get in html format
app.get("/users",async(req,res)=>{
    const allDbUsers= await User.find({});
    const html=`
    <ul>
        ${allDbUsers.map(user=>`<li>${user.firstName}-${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html);
})

//get in json format
app.get('/api/users',async (req,res)=>{
    const allDbUsers = await User.find({});
    res.json(allDbUsers);
})

//post new user
app.post('/api/users',async (req,res)=>{
    const body=req.body;
    console.log("body",body);
    if(!body || !body.first_name || !body.last_name || !body.gender || !body.email || !body.job_title){
        res.status(400).json({message:"all fields are required"});
    }
    const result=   await User.create({
        firstName   : body.first_name,
        lastName    : body.last_name,
        gender      : body.gender,
        email       : body.email,
        jobTitle    : body.job_title,
    })
    res.status(201).json({msg:'success'});
})

app.route('/api/users/:id')
    .get(async (req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    res.json(user);
}).patch(async(req,res)=>{
    //edit the user with id

    await User.findByIdAndUpdate(req.params.id,{lastName:req.body.lastName});
    res.json({msg:'updated Successfully'})
}).delete(async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({msg:"deleted successfully"});
})

app.listen(port,()=>{
    console.log(`Server listening at ${port}`);
})