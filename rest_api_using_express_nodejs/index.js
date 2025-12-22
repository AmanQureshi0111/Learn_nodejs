const express=require('express');
let users=require("./MOCK_DATA.json");
const app=express();
const PORT=8000;
const fs=require("fs");

//middleware-plugin
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//get in html format
app.get("/users",(req,res)=>{
    const html=`
    <ul>
        ${users.map(user=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
})

//get in json format
app.get('/api/users',(req,res)=>{
    res.json(users);
})

//post new user
app.post('/api/users',(req,res)=>{
    const body=req.body;
    console.log("body",body);
    users.push({id: users.length+1,...body});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        res.json({status:'success',id:users.length});
    })
})


app.route('/api/users/:id')
    .get((req,res)=>{
    const id=Number(req.params.id);
    const user = users.find((user)=> user.id===id);
    if(!user){
        res.status(404).json({message:"User not found"})
    }
    res.json(user);
}).patch((req,res)=>{
    //edit the user with id
    const id=Number(req.params.id);
    const user = users.find((user) => user.id===id);
    if(!user){
        res.status(404).json({message:"User not found"});
    }
    Object.assign(user,req.body); //change only the given parameter, not whole user.
    res.json({message:"User Updated",user});
}).delete((req,res)=>{
    //delete the user with id
    const id=Number(req.params.id);
    const index=users.findIndex(user => user.id === id); //find the index of the user with id
    if(index==-1){
        res.status(404).json({message:"User not found"});
    }
    users.splice(index,1); // array_name.splice(index,x) -> delete the x resources starting from index (does not make hole)
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        res.status(200).json({message:"User deleted successfully",remainingUsers:users.length});
    }) // after deleting rewrite again to change permanently
    
})

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})