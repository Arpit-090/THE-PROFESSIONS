


const connectToSocket = (io)=>{
        io.on("connection",(socket)=>{
            console.log("socket is connected",socket.id);

        socket.on('join',(userId)=>{
            userSocketMap[userId]=socket.id;
            socket.userId=userId;
            socket.join(userId);
             console.log("socket is joined",socket.id,"user id",userId);
        });

        socket.on('call-user',({to,from,roomID})=>{
            io.to(to).emit('incoming-call',({from,roomID}));
        });
      
        socket.on('send-message',({to,from,message})=>{
            io.to(to).emit('receive-message',({from,message}));
        });

        socket.on('offer',({to,offer})=>{
            const targetSocket = userSocketMap[to];
            if(targetSocket){
                 io.to(targetSocket).
                 emit('offer',({from:socket.userId,offer}));}
        });

        socket.on('answer',({answer,to})=>{
            const targetSocket = userSocketMap[to];
            if(targetSocket)
            io.to(targetSocket).emit('answer',({from:socket.userId,answer}));
        });

        socket.on('ice-condidate',({to,candidate})=>{
            const targetSocket = userSocketMap[to];
            if(targetSocket){
                io.to(targetSocket).emit('ice-condidate',{
                    candidate,
                    from:socket.userId
                })
            }
        })

        socket.on('error',(error)=>{
            console.log("problem in socket.js ",error)
        });

        socket.on("disconnect", () => {
            if(socket.userId){
                delete userSocketMap[socket.userId];
            }
        console.log("User disconnected",socket.userId);
});
            
        });
}

export {connectToSocket};