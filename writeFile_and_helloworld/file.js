const fs=require("fs")
//async
// fs.writeFile("./test.txt","AmanQure VELLORE",(err)=>{})
//sync
fs.writeFileSync("./test.txt","AmanQure VELLORE")
fs.appendFileSync("./test.txt","\nCSE with Bio")

//read file Sync
// const result=fs.readFileSync("./test.txt","utf8")
// console.log(result)


//read file Async

fs.readFile("./test.txt","utf8",(err,result)=>{
    if(err){
        console.log("eroors= ",err)
    }else{
        console.log(result);
    }
})
