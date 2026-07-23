import {io} from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
let socket;
const connectToSocket =(userId)=>{
    socket = io(API_URL);

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