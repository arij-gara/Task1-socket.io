const express =require('express');
const app=express();
const httpserver =require("http").createServer(app)
let io = require("socket.io")(httpserver)
let connections=[];

io.on("connect", (socket) =>{
    connections.push(socket);
    console.log(`${socket.id} has connected to server`)

    socket.on("draw" , (data) => {
        connections.forEach( (con)=>  {
            if(con.id !==socket.id) {
                con.emit("ondraw", { x: data.x, y: data.y });
            }
        })
    })

    socket.on("down", (data) => {
        connections.forEach( (con)=> {
            if(con.id !== socket.id) {
                con.emit("ondown", { x: data.x, y: data.y})
            }
        })
    })


    socket.on("disconnect" , (reason) => {
        console.log(`${socket.id} has disconnected `)
        connections = connections.filter( (con) => con.id !== socket.id)
    })
})
app.use(express.static("public"))


let port= process.env.PORT || 3001;
httpserver.listen(port, () =>{
    console.log(`application is running on port ${port}`)
})