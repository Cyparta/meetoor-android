// import Peer from 'peerjs';
// import { useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// /////////////////////////////////////////////////////////////////////
// const CallPeerMeetoor = ({ onMessage, infoCall }) => {
//     const { callData } = useSelector(state => state.sign.langData);
//     const mainSocket = useSelector(state => state.main.socket);
//     const socketLive = useSelector(state => state.socket.live);
//     const When = useSelector(state => state.main.when);
//     const sendMessage = useSelector(state => state.sign.sendMessage);
//     /////////////////////////////////////////////////////////////////
//     const Servers = useSelector(state => state.main.servers);
//     const [PeerId, setMyPeerId] = useState("");
//     const [PEER, setPEER] = useState(null);
//     console.log("CallPeerMeetoor ~ PEER", PEER);
//     /////////////////////////////////////////////////////////////////
//     const [MyStream, setStreem] = useState(null);
//     const [RemoteStream, setRemoteStream] = useState(null);
//     const [RemotePeer, setRemotePeer] = useState(null);
//     const [Sender, setSender] = useState(null);
//     const [IsScreen, setIsScreen] = useState(null);
//     const [MyShareScreen, setMyShareScreen] = useState(null);
//     const [ShareScreen, setRemoteShareScreen] = useState(null);
//     const [IsStartVideo, setStartVideo] = useState(null);
//     const [IsMicActive, setActiveMic] = useState(true);
//     const [IsConnected, setConnected] = useState({ connected: false, time: null });
//     /////////////////////////////////////////////////////////////////
//     const SenderData = useCallback((data) => Sender?.send(JSON.stringify(data)), [Sender]);
//     /////////////////////////////////////////////////////////////////
//     const ToggleMic = useCallback(() => {
//         const toggleMicStream = (cond) => {
//             MyStream?.getAudioTracks().forEach(function (track) {
//                 track.enabled = cond;
//             });
//             setActiveMic(cond);
//             SenderData({ type: "on-mic", peerId: PeerId, active: cond });
//         }

//         if (IsMicActive) {
//             toggleMicStream(false);
//         } else {
//             toggleMicStream(true);
//         }
//     }, [IsMicActive, MyStream, PeerId, SenderData]);
//     /////////////////////////////////////////////////////////////////
//     const ToggleCamera = useCallback(async () => {
//         const getUserMediaToStream = (options) => {
//             // navigator.mediaDevices.getUserMedia(options).then(stream => {
//             //     MyStream?.getTracks()?.forEach((track) => track.stop());
//             //     setStreem(stream);
//             //     let isVideo = options.video ? true : false;
//             //     if (isVideo && !IsMicActive) {
//             //         stream.getAudioTracks().forEach(function (track) {
//             //             track.enabled = false;
//             //         });
//             //     } else {
//             //         setActiveMic(true);
//             //     }
//             //     setStartVideo(isVideo);
//             //     RemotePeer && PEER.call(RemotePeer.peer, stream, { metadata: { isVideo } });
//             // });
//         }
//         if (!IsStartVideo) {
//             getUserMediaToStream({
//                 video: true,
//                 audio: true
//             })
//         } else {
//             getUserMediaToStream({ audio: true });
//         }
//     }, [IsStartVideo, IsMicActive, RemotePeer, MyStream, PEER]);
//     /////////////////////////////////////////////////////////////////
//     const HandleShare = useCallback(async () => {
//         const endShareStreamBack = () => {
//             setIsScreen(null);
//             setMyShareScreen(null);
//             // window.StreamShare = null;
//             // SenderData({ type: "endShare" });
//         }
//     }, [MyShareScreen, RemotePeer, PEER, IsScreen, SenderData]);
//     /////////////////////////////////////////////////////////////////
//     useEffect(() => {
//         const { event, data, when } = socketLive;
//         if (when >= When()) switch (event) {
//             case 'receiveCall':
//                 // window.endCall = false;
//                 const call = PEER.call(data.peerId, MyStream, { metadata: { isVideo: IsStartVideo } });
//                 if (!call) return;
//                 call.on('stream', userVideoStream => {
//                     setRemoteStream({ id: data.peerId, stream: userVideoStream });
//                     sendMessage({
//                         type: "start-foreground",
//                         title: callData.voiceCall,
//                         message: infoCall.fullName,
//                         meter: true,
//                         button: true,
//                         buttonText: callData.endCall,
//                         buttonType: "end-call"
//                     });
//                 });

//                 call.on('close', () => {
//                     // if (window.endCall) return;
//                     onMessage({ type: "end-call", peerId: data.peerId });
//                 });

//                 const sender = PEER.connect(data.peerId);
//                 setSender(sender);
//                 setRemotePeer(call);

//                 if (IsScreen) {
//                     PEER.call(data.peerId, MyShareScreen, { metadata: { isScreen: true } })
//                 }
//                 setConnected({ connected: true, time: Date.now() });
//                 sender.on("open", () => {
//                     sender?.send(JSON.stringify({
//                         type: "on-mic",
//                         peerId: data.peerId,
//                         active: IsMicActive
//                     }));
//                 });
//                 break;

//             case 'endCall':
//                 if (onMessage) {
//                     window.endCall = true;
//                     onMessage({ type: "end-call", peerId: data.peerId });
//                 }
//                 if (RemotePeer) RemotePeer.close();
//                 setSender(null);
//                 setRemoteStream(null);
//                 setConnected({ connected: false, time: null });
//                 break;

//             default:
//                 break;
//         }
//     }, [socketLive]);
//     /////////////////////////////////////////////////////////////////
//     useEffect(() => {
//         let isConnected = false;
//         // window.Stream = null;
//         // window.StreamShare = null;
//         // window.cancelCallWithoutEffect = false;
//         const PeeR = new Peer(undefined, {
//             config: {
//                 'iceServers': Servers.run,
//                 'sdpSemantics': 'unified-plan'
//             },
//             path: "/",
//             host: "rtc.meetoor.com",
//             port: "9000",
//             pingInterval: 30 * 1000
//         });
//         setPEER(PeeR);

//         // navigator.mediaDevices.getUserMedia({
//         //     audio: true
//         // }).then(stream => {
//         //     setStreem(stream);
//         //     window.Stream = stream;
//         // });

//         PeeR.on('call', call => {
//             call.answer(window.Stream);
//             setRemotePeer(call);
//             setSender(PeeR.connect(call.peer));
//             setConnected((conn) => {
//                 if (conn.connected) return conn;
//                 return { connected: true, time: Date.now() }
//             });
//             call.on('stream', stream => {
//                 if (call?.metadata?.isScreen) setRemoteShareScreen({ id: call.peer, stream });
//                 else {
//                     setRemoteStream({ id: call.peer, stream, isVideo: call?.metadata?.isVideo });
//                     sendMessage({
//                         type: "start-foreground",
//                         title: callData.voiceCall,
//                         message: infoCall.fullName,
//                         meter: true,
//                         button: true,
//                         buttonText: callData.endCall,
//                         buttonType: "end-call"
//                     });
//                 }
//             });
//         });

//         PeeR.on('connection', function (conn) {
//             isConnected = true;
//             // conn.on('data', function (data) {
//             //     let parseData = JSON.parse(data);
//             //     if (parseData.type === "endShare") {
//             //         setRemoteShareScreen(null);
//             //     }
//             //     onMessage && onMessage(parseData);
//             // });
//         });

//         PeeR.on('open', peerid => {
//             setMyPeerId(peerid);
//             // if (infoCall.caller) {
//             //     mainSocket.emit("startCall", {
//             //         userName: infoCall.userName,
//             //         peerId: peerid
//             //     });
//             // }
//         });

//         const closeAtOff = () => {
//             PeeR?.disconnect();
//             PeeR?.destroy();
//             // window.Stream?.getTracks()?.forEach((track) => track.stop());
//             // window.StreamShare?.getTracks()?.forEach((track) => track.stop());
//             // sendMessage({ type: "stop-foreground" });
//             // if (window.cancelCallWithoutEffect) return;
//             // if (isConnected) mainSocket.emit("endCall", {
//             //     userName: infoCall.userName,
//             //     caller: infoCall.caller
//             // });
//             // else mainSocket.emit("rejectCall", {
//             //     userName: infoCall.userName,
//             //     caller: infoCall.caller
//             // })
//         }
//         /////////////////////////////////////////////////
//         return () => {
//             closeAtOff();
//         }
//     }, []);
//     //////////////////////////////////////////////////////////////////
//     return {
//         MyStream, RemoteStream, ShareScreen, IsScreen,
//         IsStartVideo, IsMicActive, IsConnected, PeerId,
//         ToggleMic, SenderData, HandleShare, ToggleCamera
//     };
// }

// export default CallPeerMeetoor;