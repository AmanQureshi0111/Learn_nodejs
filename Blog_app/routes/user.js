const {Router}= require('express')
const User = require('../models/user');
const router=Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.post('/signup',async (req,res)=>{
    const {fullname,email,password}=req.body;
    await User.create({
        fullName:fullname,
        email,
        password
    });
    res.redirect("/");
})

router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.matchPassword(email,password);
        console.log('User',user);
        return res.redirect('/');
    }catch(error){
        return res.status(401).send(error.message);
    }
})

module.exports=router;
