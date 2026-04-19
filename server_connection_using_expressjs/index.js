const http  = require("http");
const fs    = require("fs");
const url   = require("url");
const express=require("express")
const port = 3000;
const app=express();

// using http
function myHandler(req,res){
    if(req.url==="/fevicon.ico") return res.end();
    const log=`${Date.now()}: ${req.url} ${req.method} New Req Received\n`;
    const myUrl=url.parse(req.url,true);
    console.log(myUrl);
    fs.appendFile("log.txt",log,(err,data)=>{
        switch (myUrl.pathname){
            case "/":
                res.end("HomePage");
                break;
            case "/about":
                const username=myUrl.query.myname;
                res.end(`Hello ${username}, I'm Aman Qureshi`);
                break; 
            case "/signup":
                res.end("This is a signup page");
                break;
            default:
                res.end("404 not found");    
        }
    });
}
const myServer  = http.createServer(app);

myServer.listen(3000,()=>console.log("Server started!!"));

//using express js
app.get('/',(req,res)=>{
    res.send("Hello from home page");
})

app.get("/about",(req,res)=>{
    res.send(`Hello ${req.query.name}, from ${req.query.city}`);
})
app.listen(port,()=>{
    console.log(`app listening on port ${port}`)
})