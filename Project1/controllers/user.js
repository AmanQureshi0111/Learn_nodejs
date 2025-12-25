const { User } =    require('../models/index');
async function handleGetAllUsers(req,res){
    const allDbUsers = await User.find({});
    res.json(allDbUsers);
}

async function handleGetUserById(req,res){
    const user=await User.findById(req.params.id);
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    res.json(user);
}

async function handleUpdateUserById(req,res){
    //edit the user with id
    await User.findByIdAndUpdate(req.params.id,{lastName:'Changed'});
    res.json({msg:'updated Successfully'})
}

async function handleDeleteUserById(req,res){
    await User.findByIdAndDelete(req.params.id);
    res.json({msg:"deleted successfully"});
}

async function handleCreateNewUser(req,res){
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
    res.status(201).json({msg:'success',id:result._id});
}
module.exports={
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}