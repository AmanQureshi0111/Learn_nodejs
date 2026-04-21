const express= require("express")
const app=express()
const path=require("path");

const PORT=8000



app.listen(PORT,()=>{
    console.log(("Server listening on PORT 8000"));
})