import { useEffect } from "react";
// import  getSocket  from "../socket/socketConnect.js";
import { useState } from "react";
import {incommingCall} from "../socket/socketFrontControllers.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";



const CallListener = () => {
  const {user}=useContext(AuthContext)
 const [caller , setCaller]=useState(null);
 const [roomID , setRoomID]=useState(null);
      console.log("we are inside calllistener invoked");
useEffect(() => {
  if(user){
  console.log("use effect of calllistener invoked");
  incommingCall(setCaller,setRoomID)
  console.log(caller);
  console.log(roomID);
  }
}, [caller, roomID, user]);

const handleReject=()=>{
  setCaller(null);
}

return caller ? (
  <div className="fixed top-5 right-5 z-50 bg-black text-white p-4 rounded">
    📞 Incoming call from {caller}  with RoomID  {roomID}
   <div> 
    <button className="bg-green-400 cursor-alias">Accept</button>
    <button className="bg-red-600" onClick={handleReject}>Reject</button>
  </div>
  </div>
) : null;
};

export default CallListener;