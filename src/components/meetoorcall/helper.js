//////////////////////////////////////////////////
// import { useState, useEffect, useRef, useCallback, memo } from 'react';
// import Hark from "hark";
// import useDetectPhone from '../../../main/detectphone';
// import { AudioSvg, CamSvg, ExpandSvg, MicSvg, ShareSvg } from '../icons/icons';
// import './call.scss';
// ////////////////////////////////////////////
// export const MyStreamElem = memo(({ stream, userPhoto,
//     ToggleMic, IsMicActive, isVideo, ToggleCamera }) => {
//     const myStreamRef = useRef();
//     const [micAnim, setMicAnim] = useState();
//     /////////////////////////////////////////////////////
//     useEffect(() => {
//         if (!stream) return;
//         myStreamRef.current.srcObject = stream;
//         let speechEvents = Hark(stream, { interval: 120, smoothing: 0.12 });
//         speechEvents.on('speaking', function () {
//             setMicAnim(true);
//         });

//         speechEvents.on('stopped_speaking', function () {
//             setMicAnim(false);
//         });

//         return () => {
//             if (!stream) return;
//             stream?.getTracks()?.forEach((track) => track.stop())
//             speechEvents?.on('speaking', () => { })
//             speechEvents?.on('stopped_speaking', () => { });
//         }
//     }, [stream]);
//     /////////////////////////////////////////////////////
//     return (<div className="stream-outer remotestream">
//         <div className="stream-user">
//             {isVideo ? null : <img src={userPhoto} alt="img" />}
//             <video className={isVideo ? "active" : ""} ref={myStreamRef} controls={false} volume={0}
//                 playsInline={true} autoPlay={true} muted="muted" />
//         </div>

//         <div className="stream-ctr">
//             <button className="ctr" onClick={ToggleMic}>
//                 <MicSvg className="drk" type={IsMicActive} size={22} anim={micAnim} />
//             </button>

//             <button className="ctr" onClick={ToggleCamera}>
//                 <CamSvg className="drk" type={true} size={22} />
//             </button>
//         </div>
//     </div>)
// });
// ////////////////////////////////////////////
// export const RemoteStreamElem = memo(({ stream, isVideo, userPhoto, setExpand, expand, audioChange }) => {
//     const remoteAudioRef = useRef();
//     const [audAnim, setAudAnim] = useState(false);
//     const [activeAudio, setActiveAudio] = useState(true);
//     //////////////////////////////////////////////////////
//     const expandThis = () => {
//         setExpand(expand === "expand-cam" ? "" : "expand-cam");
//     }
//     //////////////////////////////////////////////////////
//     const ToggleAudio = useCallback(() => {
//         const toggleAudioStream = (cond) => {
//             stream?.getAudioTracks().forEach(function (track) {
//                 track.enabled = cond;
//             });
//             setActiveAudio(cond);
//         }

//         if (activeAudio) {
//             toggleAudioStream(false);
//         } else {
//             toggleAudioStream(true);
//         }
//     }, [activeAudio, stream]);
//     /////////////////////////////////////////////////////
//     useEffect(() => {
//         if (!stream) return;
//         remoteAudioRef.current.srcObject = stream;
//         let speechEvents = Hark(stream, {});
//         speechEvents.on('speaking', function () {
//             setAudAnim(true);
//         });

//         speechEvents.on('stopped_speaking', function () {
//             setAudAnim(false);
//         });

//         return () => {
//             stream?.getTracks()?.forEach((track) => track.stop())
//             speechEvents?.on('speaking', () => { })
//             speechEvents?.on('stopped_speaking', () => { });
//         }
//     }, [stream]);
//     ///////////////////////////////////////////////////////
//     return (<div className="stream-outer" id="remotestream-call">
//         <div className="stream-user">
//             {isVideo ? null : <img src={userPhoto} alt="img" />}
//             <video className={isVideo ? "active" : ""} ref={remoteAudioRef} controls={false}
//                 playsInline={true} autoPlay={true} />
//         </div>
//         <div className="stream-ctr">
//             {isVideo ? <button className="ctr" onClick={expandThis}>
//                 <ExpandSvg className="drk" size={22}
//                     type={expand === "expand-cam"} />
//             </button> : null}

//             <button className="ctr" disabled={!audioChange} onClick={ToggleAudio}>
//                 <AudioSvg className="drk" type={activeAudio} size={22} anim={audAnim} />
//             </button>
//         </div>
//     </div>)
// });
// ////////////////////////////////////////////
// export const RemoteScreenElem = memo(({ stream, id, setExpand, expand }) => {
//     const remoteScreenRef = useRef();
//     //////////////////////////////////////////////////////
//     const expandThis = () => {
//         setExpand(expand === "expand-screen" ? "" : "expand-screen");
//     }
//     ///////////////////////////////////////////////////////
//     useEffect(() => {
//         if (stream === null) return;
//         remoteScreenRef.current.srcObject = stream;
//         return () => stream?.getTracks()?.forEach((track) => track.stop())
//     }, [stream]);
//     ///////////////////////////////////////////////////////
//     return (<div className="screen-share" id="screenshare-call">
//         <button className="ctr-big" onClick={expandThis}>
//             <ExpandSvg className="drk" size={22} type={expand} />
//         </button>
//         <video ref={remoteScreenRef} controls={false}
//             playsInline={true} autoPlay={true} />
//     </div>)
// });
// /////////////////////////////////////////////////////////
// export const ButtonShareScreen = memo(({ IsScreen, HandleShare, NoShare }) => {
//     const { detect } = useDetectPhone();
//     /////////////////////////////////////////////////////
//     const toggelScreen = useCallback(() => {
//         if (detect) NoShare();
//         else HandleShare();
//     }, [detect, HandleShare, NoShare]);
//     /////////////////////////////////////////////////////
//     return (<button className="share" onClick={toggelScreen}>
//         <ShareSvg className="drk" size={20} type={IsScreen} />
//     </button>)
// });