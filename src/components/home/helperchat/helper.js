import React, { useEffect, useState, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AnyText } from '../helperprefernce';
import { ProcessTextWithoutLink } from '../../../main/processtext/processtext';
import {
    OuterNameContent, OuterMessageContent, OuterOneView
} from '../helpernotification/heplernotifycss';
import { CallCancelSvg, PhoneSvg, CloseSvg } from '../../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { Input } from '../../sign/helperinput';
import { ButtonCirculer } from '../sliderroom/helperroomcss';
import { MaterialIndicator } from 'react-native-indicators';
import { colors, pixel } from '../../../styles/basecss';
import { css } from 'styled-components';
//////////////////////////////////////////////////
export const Chat = memo(({ text, who, width, isRTL, isDark }) => {
    const contentWithoutEffect = ProcessTextWithoutLink(text,
        isRTL, undefined, isDark ? "back2" : "clr1");
    //////////////////////////////////////////////
    return (<OuterNameContent isRTL={isRTL} width={"100%"}>
        {who ? who : null}
        <OuterMessageContent isRTL={isRTL}
            width={parseInt(width - (moderateScale(60) + (who ? moderateScale(36) : 0))) + "px"}>
            {contentWithoutEffect}
        </OuterMessageContent>
    </OuterNameContent>);
})
//////////////////////////////////////////////////
export const Call = memo(({ call, who, isRTL }) => {
    const { callData } = useSelector(state => state.sign.langData);
    //////////////////////////////////////////////
    return (<OuterNameContent isRTL={isRTL} width={"100%"}>
        {who ? who : null}
        <OuterMessageContent isRTL={isRTL} call={call}>
            {call ?
                <>
                    <PhoneSvg size={moderateScale(18)} color="back3" />
                    <AnyText small target lower color="back3"> {callData.callEnded} </AnyText>
                </>
                :
                <>
                    <CallCancelSvg size={moderateScale(18)} color="back3" />
                    <AnyText small target lower color="back3"> {callData.notAnswer} </AnyText>
                </>
            }
        </OuterMessageContent>
    </OuterNameContent>);
})
//////////////////////////////////////////////////
// export const EditableRender = memo(({ username, type, opnner, photo, fullname }) => {
//     const dispatch = useDispatch();
//     const { placeholder } = useSelector(state => state.sign.langData);
//     const When = useSelector(state => state.main.when);
//     const token = useSelector(state => state.sign.token);
//     const socketLive = useSelector(state => state.socket.live);
//     const mainSocket = useSelector(state => state.main.socket);
//     const User = useSelector(state => state.main.user);
//     //////////////////////////////////////////////
//     const chatIdStr = type ? `chat_id-${username}` : `chat_Team_id-${username}`;
//     //////////////////////////////////////////////
//     const sendChats = useCallback(async (text, file, recordFile) => {
//         let virId = Math.random().toString(36).substr(2, 9);
//         const chatTemp = {
//             time: Date.now(),
//             message: text ? text : recordFile ? "$record$" : text,
//             msgid: virId,
//             refMsg: 0,
//             isNew: false,
//             isRead: true,
//             photo: photo,
//             type: true,
//             fullname: fullname,
//             isFriend: true,
//             username: username,
//             whoSent: { fullname: User.fullName, username: User.username }
//         }
//         if (type) {
//             chatTemp.type = true;
//             dispatch(Actions.type("setMessages", {
//                 type: 'replace_up',
//                 data: {
//                     target: username,
//                     key: "username",
//                     replace: chatTemp
//                 }
//             }));
//             mainSocket.emit("onTyping", {
//                 type: false,
//                 to: username
//             });
//             if (recordFile) {
//                 let data = new FormData();
//                 data.append('file', recordFile);
//                 data.append('chatRecevier', username);
//                 //////////////////////////////////////////
//                 const response = await Axios.post("onChatFile/", data, {
//                     headers: {
//                         'Authorization': `Token ${token}`
//                     }
//                 });
//                 const chatFile = response.data.msgid;
//                 if (chatFile) mainSocket.emit("onChat", { text: "$record$", msgid: response.data.msgid, to: username, record: true, virId });
//             }
//             else {
//                 mainSocket.emit("onChat", { text, to: username, refMsg: 0, virId });
//             }
//         }
//         else {
//             chatTemp.type = true;
//             dispatch(Actions.type("setMessages", {
//                 type: 'replace_up',
//                 data: {
//                     target: username,
//                     key: "username",
//                     replace: chatTemp
//                 }
//             }));
//             mainSocket.emit("onTypingTeam", {
//                 type: false
//             });
//             if (recordFile) {
//                 let data = new FormData();
//                 data.append('file', recordFile);
//                 data.append('teamName', username);
//                 //////////////////////////////////////////
//                 const response = await Axios.post("onChatTeamFile/", data, {
//                     headers: {
//                         'Authorization': `Token ${token}`
//                     }
//                 });
//                 const chatFile = response.data.msgid;
//                 if (chatFile) mainSocket.emit("onChat", { text: "$record$", msgid: response.data.msgid, teamName: username, record: true, virId });
//             }
//             else {
//                 mainSocket.emit("onChatTeam", { text, teamName: username });
//             }
//         }
//         dispatch(Actions.type("setOpenMoreWin", false))
//     }, [username, photo, fullname, type, chatIdStr, token]);
//     //////////////////////////////////////////////
//     const seenChat = useCallback(() => {
//         if (type) mainSocket.emit("onChatSeen", { reciver: username });
//         else mainSocket.emit("onChatTeamSeen", { isSeen: true, teamName: username });
//     }, [username]);
//     //////////////////////////////////////////////
//     const sendTyping = useCallback((action) => {
//         if (type) mainSocket.emit("onTyping", {
//             type: action,
//             to: username
//         });
//         else mainSocket.emit("onTypingTeam", {
//             type: action,
//             teamName: username
//         });
//     }, [type, username]);
//     //////////////////////////////////////////////
//     const OnTyping = useTypingMeetoor({
//         down: () => sendTyping(true),
//         up: () => sendTyping(false)
//     });
//     //////////////////////////////////////////////
//     useEffect(() => {
//         const { event, data, when } = socketLive;
//         if (when >= When()) switch (event) {
//             case "onChat":
//                 const chat = data.chat;
//                 if (opnner && User.userid !== chat.userid) {
//                     mainSocket.emit("onChatSeen", { reciver: username });
//                 }
//                 break;
//             case "onChatTeam":
//                 mainSocket.emit("onChatTeamSeen", { isSeen: true, teamName: username });
//                 break;

//             default:
//                 break;
//         }
//     }, [socketLive]);
//     //////////////////////////////////////////////
//     return (<ContentEditableMain
//         callBack={sendChats}
//         idName={chatIdStr}
//         placehold={placeholder.addMsg}
//         onkeydown={OnTyping}
//         onfocus={() => seenChat()}
//         allowRecord={type}
//         allowFile={false} />)
// });
/////////////////////////////////////////////////////
export const SearchChatUser = memo(({ setResultSearch }) => {
    const { placeholder } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const mainSocket = useSelector(state => state.main.socket);
    const When = useSelector(state => state.main.when);
    const [isEmpty, setIsEmpty] = useState(true);
    const [waitResult, setWaitResult] = useState(false);
    const waitType = React.useRef(0);
    const inputRef = React.useRef();
    /////////////////////////////////////////////////
    const onSearch = useCallback((value) => {
        setWaitResult(true);
        mainSocket.emit("owenChatSearch", {
            search: value.toLowerCase()
        });
    }, []);
    /////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "owenChatSearch":
                setResultSearch(data);
                setWaitResult(false);
                break;
            default:
                break;
        }
    }, [socketLive]);
    //////////////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        css={css`margin: ${pixel(4)} 0;padding: 0 ${pixel(4)};
            justify-content: center;background: transparent;overflow: hidden;`}>
        <Input placeholder={placeholder.finduser}
            placeholderTextColor={colors[isDark ? "back2" : "clr4"]}
            color={isDark ? "back2" : "clr3"}
            onChange={(value) => {
                if (value.trim().length >= 2) {
                    clearTimeout(waitType.current || 0);
                    if (waitResult) return;
                    waitType.current = setTimeout(() => {
                        setIsEmpty(false);
                        onSearch(value);
                    }, 500);
                }
            }} innerRef={inputRef}
            onFocus={() => setIsEmpty(false)}
            onBlur={() => setIsEmpty(true)}
            radius noBack noBorder mainMargin={moderateScale(3)}
            autoFocus={false} back={isDark ? "clr3" : "back3"}
            css={css`padding: 0 ${pixel(5)};border-radius: ${pixel(20)};overflow: hidden;
                ${isRTL ? `padding-right: ${pixel(32)};` : `padding-left: ${pixel(32)};`}`} />
        {isEmpty ? null : <ButtonCirculer size={pixel(32)} back="clr3" activeOpacity={0.8}
            css={css`position: absolute;margin: 0;left: ${pixel(5)};
                border-radius: ${pixel(18)};z-index: 3;top: ${pixel(4)};`}
            onPress={() => {
                inputRef.current.clear();
                setResultSearch(null);
                setIsEmpty(true);
            }}>
            {waitResult ? <MaterialIndicator size={moderateScale(23)} color={colors["clr2"]} /> :
                <CloseSvg size={moderateScale(13)} />}
        </ButtonCirculer>}
    </OuterOneView>)
});