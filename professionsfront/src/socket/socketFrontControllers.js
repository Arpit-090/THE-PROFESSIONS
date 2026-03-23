import { getSocket } from "./socketConnect";
// call functions through sockets
 const emitCall =(to,from,roomID)=>{
    const socket = getSocket();
    if(!socket){
        console.log("sockets are not connected");
    }else{
        socket.emit('call-user',{
            to,
            from,
            roomID
        })
        console.log("calling 📞 to: ",to);
    }
 }


 const incommingCall=(callback1,callback2)=>{
    const socket = getSocket();
      if (!socket) return;
    socket.on('incoming-call',(data)=>{
          console.log("incoming call from",data.from);
          callback1(data.from);
          callback2(data.roomID);
    });
  
    
 }


 const offIncommingCall =(callback)=>{
    const socket = getSocket();
      if (!socket) return;
    socket.off('incoming-call',callback);
 }

 // message functions through sockets
const emitMsg =(to,from,msg)=>{
    const socket = getSocket();
    if(!socket){
        console.log("sockets are not connected");
    }else{
        socket.emit('send-message',{
            to,
            from,
            msg
        })
        console.log("a message to: ",to);
    }
 }

  const receiveMsg =(callback)=>{
    const socket = getSocket();
      if (!socket) return;
    socket.on('receive-message',callback);
 }

 



 export  
 {emitCall,
    incommingCall,
    offIncommingCall,
    emitMsg,
    receiveMsg

 };