//////////////////////////////////////////////////
import React, { memo, useState, useEffect } from 'react';
import {
    mediaDevices,
    RTCView,
    registerGlobals,
    MediaStreamTrack
} from 'react-native-webrtc';
// import CallPeerMeetoor from '../../meetoor-peer/callpeer';
import { AnyText } from '../home/helperprefernce';
// registerGlobals()
/////////////////////////////////////////////////////
const MeetoorCallMain = ({ userName, userPhoto, fullName, caller = false }) => {
    /////////////////////////////////////////////////////
    const [stream, setStream] = useState(null)
    // const {
    //     MyStream, RemoteStream, ShareScreen, IsScreen,
    //     IsMicActive, IsConnected, IsStartVideo, PeerId,
    //     ToggleMic, HandleShare, ToggleCamera
    // } = CallPeerMeetoor({
    //     infoCall: { userName: "devi", caller, fullName: "ahmad" },
    //     onMessage: (msg) => {
    //     }
    // });
    useEffect(() => {
        // if (!stream) {
        //     let s;
        //     try {
        //       s = await mediaDevices.getUserMedia({ video: true });
        //       setStream(s);
        //     } catch(e) {
        //       console.error(e);
        //     }
        //   }
        let isFront = true;
        // mediaDevices.getDisplayMedia({
        //     audio: true,
        //     video: {
        //         width: 640,
        //         height: 480,
        //         frameRate: 30,
        //     }
        // })
        //     .then(stream => {
        //         setStream(stream.toURL())
        //         console.log(" mediaDevices.enumerateDevices ~ stream", stream.toURL())
        //         // Got stream!
        //     })
        //     .catch(error => {
        //         // Log error
        //     });

        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 640,
                    height: 480,
                    frameRate: 30,
                    facingMode: (isFront ? "user" : "environment"),
                    deviceId: videoSourceId
                }
            })
                .then(stream => {
                    setStream(stream)
                    console.log(" mediaDevices.enumerateDevices ~ stream", stream.toURL())
                    // Got stream!
                })
                .catch(error => {
                    // Log error
                });
        });
    }, [])
    return (<>
        <AnyText color="clr2" onPress={() => {
            stream.getVideoTracks().forEach((track) => {
                track._switchCamera()
            })
        }} >اختبار المكالمه</AnyText>
        {stream ? <RTCView streamURL={stream.toURL()} zOrder={5} style={{ flex: 1 }} /> : null}
    </>);
}

export default memo(MeetoorCallMain);