import {io} from 'socket.io-client';

let socket;
const connectToSocket =(userId)=>{
    socket = io("http://localhost:3000");

    socket.on("connect",()=>{
        console.log("connected successfully with sockets ", socket.id);

        // join user room  
        socket.emit("join",userId);
    });
    return socket;
}

export const getSocket =()=>{
    return socket;
}


export default connectToSocket;