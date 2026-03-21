import React from "react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from "react-router-dom";


const Call = () => {

        const {userId} = useParams();
        const userID = userId;

        const roomID = Date.now().toString();

        let myMeeting = async (element) => {
                // generate Kit Token
                const appID = 431468416;
                const serverSecret = "704948ea8e7eaf78ba7d573001286b12";
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID);

                // Create instance object from Kit Token.
                const zp = ZegoUIKitPrebuilt.create(kitToken);

                // start the call
                zp.joinRoom({
                        container: element,
                        sharedLinks: [
                                {
                                        name: 'Personal link',
                                        url:
                                                window.location.protocol + '//' +
                                                window.location.host + window.location.pathname +
                                                '?roomID=' +
                                                roomID,
                                },
                        ],
                        scenario: {
                                mode: ZegoUIKitPrebuilt.OneONoneCall, // To implemt group calls, modify the parameter here to [ZegoUIKitPrebuilt.GroupCall].
                        },
                });
        }




        return (<>
                <h1 className="text-gray-500 text-center font-bold">call here</h1>

                <div
                        className="myCallContainer"
                        ref={myMeeting}
                        style={{ width: '100vw', height: '100vh' }}
                ></div>
        </>)

}

export default Call;