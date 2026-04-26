const http=require("http")
const express= require("express")
const path=require("path")
const {Server}=require("socket.io");

const app=express()
const server=http.createServer(app)
const io=new Server(server);

// Socket.io
io.on('connection',(socket)=>{
    socket.on('user-message',message=>{
        console.log('new msg',message);
        io.emit('message',message);
    })
    console.log('new user has connected',socket.id);
})

app.use(express.static(path.resolve('./public')));

app.get("/",(req,res)=>{
    return res.sendFile(path.resolve('./public/index.html'))
})

server.listen(9000,()=>{
    console.log(`Server Started at PORT:9000`);
})
