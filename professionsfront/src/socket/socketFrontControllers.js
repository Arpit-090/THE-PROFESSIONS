import { getSocket } from "./socketConnect";

// call functions through sockets
const emitCall = (to, from, roomID) => {
  const socket = getSocket();
  if (!socket) {
    console.log("sockets are not connected");
  } else {
    socket.emit("call-user", { to, from, roomID });
    console.log("calling 📞 to: ", to);
  }
};

// ✅ FIXED: Added setCaller, setRoomID — offer comes via separate 'offer' event
const incommingCall = (setCaller, setRoomID) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("incoming-call", (data) => {
    console.log("incoming call from", data.from);
    setCaller(data.from);
    setRoomID(data.roomID);
  });
};

const offIncommingCall = (callback) => {
  const socket = getSocket();
  if (!socket) return;
  socket.off("incoming-call", callback);
};

// connect ice-candidate for room
const connectICE = (to, candidate) => {
  const socket = getSocket();
  if (!socket) return;
  socket.emit("ice-condidate", { to, candidate });
};

// message functions through sockets
const emitMsg = (to, from, msg) => {
  const socket = getSocket();
  if (!socket) {
    console.log("sockets are not connected");
  } else {
    socket.emit("send-message", { to, from, msg });
    console.log("a message to: ", to);
  }
};

const receiveMsg = (callback) => {
  const socket = getSocket();
  if (!socket) return;
  socket.on("receive-message", callback);
};

const sendingOffer = (to, from, offer) => {
  const socket = getSocket();
  if (!socket) return;
  socket.emit("offer", { to, from, offer });
  console.log("offer send to ", to);
};

export {
  emitCall,
  incommingCall,
  offIncommingCall,
  emitMsg,
  receiveMsg,
  sendingOffer,
  connectICE,
};