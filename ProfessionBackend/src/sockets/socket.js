


const connectToSocket = (io)=>{
        io.on("connection",(socket)=>{
            console.log("socket is connected",socket.id);

        socket.on('join',(userId)=>{
            socket.join(userId);
        });

        socket.on('call-user',({to,from,roomID})=>{
            io.to(to).emit('incoming-call',({from,roomID}));
        });
      
        socket.on('send-message',({to,from,message})=>{
            io.to(to).emit('receive-message',({from,message}));
        });

        socket.on('error',(error)=>{
            console.log("problem in socket.js ",error)
        });

        socket.on("disconnect", () => {
        console.log("User disconnected");
});
            
        });
}

export {connectToSocket};