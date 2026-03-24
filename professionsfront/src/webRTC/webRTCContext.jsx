import { createContext, useRef } from "react";
import {connectICE} from '../socket/socketFrontControllers.js'

  const WebRtcContext =createContext();

export const WebRtcProvider = ({children})=>{
  
    const Pc =useRef(null)
    const localStream =useRef(null) 

    const createPeerConnection = (onTrackCallabck,to)=>{
        if(Pc.current) return Pc.current;

        Pc.current = new RTCPeerConnection(
            {
                iceServers:[
                    {
                        urls:"stun:stun.l.google.com:19302"
                    }
                ]
            }
        )

        Pc.current.ontrack =(event)=>{
            const remoteStream = event.streams[0];
             if(onTrackCallabck){
            onTrackCallabck(remoteStream)
        }
        }

        Pc.current.onicecandidate = (event)=>{
            if(event.candidate){
                console.log("event generated",event.candidate);
                const candidate = event.candidate;
                connectICE(to,candidate);
            }
        }

        return Pc.current;
    };

    const getPeerConnection =()=>Pc.current;

    const getLocalStream = async () => {
       localStream.current = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
       })
       return localStream.current;
    }

    const addTracks =()=>{
        if(!Pc.current || !localStream.current) return; 
        localStream.current.getTracks().forEach(track=>{
            Pc.current.addTrack(track,localStream.current);
        })
    }

    

    return(
        <WebRtcContext.Provider value={{createPeerConnection,getPeerConnection,getLocalStream,addTracks}}>
            {children}
        </WebRtcContext.Provider>
    )
}

export {WebRtcContext};
