import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../../main/Axios';
import TopSectionChatView from './chattop';
import RenderMeetoorChatBody from './chatbody';
import Actions from '../../reducer/actions';
import { TabBarBottom } from '../home/helperhome';
import ContentEditableMain from '../../main/editable/editable';
import { css } from 'styled-components';
import { comonSound } from '../../sounds/sound';
import useTypingMeetoor from '../home/helperchat/useTyping';
import SeenerChatView from './seenerchat';
import { pixel } from '../../styles/basecss';
///////////////////////////////////////////////////
const RenderMeetoorChatTeam = ({ teamName, teamPhoto, teamid }) => {
    console.log("RenderMeetoorChatTeam ~ teamName ", teamName)
    const dispatch = useDispatch();
    const mainSocket = useSelector(state => state.main.socket);
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const { placeholder } = useSelector(state => state.sign.langData);
    const chatIdStr = `chat_team_${teamName}`;
    const [seener, setSeener] = useState([]);
    //////////////////////////////////////////////
    const HandelSendChat = useCallback(async (text, file, recordFile, refMsg, virId) => {
        if (file || recordFile) {
            let data = new FormData();
            data.append('file', file ? file : recordFile);
            data.append('teamName', teamName);
            //////////////////////////////////////////
            const response = await Axios.post("onChatTeamFile/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            const chatFile = response.data.msgid;
            if (chatFile) mainSocket.emit("onChatTeam", {
                text, teamName: teamName,
                msgid: response.data.msgid,
                record: recordFile ? true : false,
                virId
            });
        }
        else {
            mainSocket.emit("onChatTeam", { text, teamName: teamName, refMsg: refMsg, virId });
        }
    }, [teamName, mainSocket]);
    //////////////////////////////////////////////
    const sendChats = useCallback((text, file, recordFile, refMsg, refData) => {
        let virId = Math.random().toString(36).substr(2, 9);
        const Message = {
            text: text ? text : recordFile ? "$record$" : file ? "$file$" + text : text,
            file: (file || recordFile) ? {
                base: file ? file.uri : recordFile ? recordFile.uri : null,
                name: file ? file.name : recordFile ? recordFile.name : ""
            } : null,
            call: null
        }
        //////////////////////////////////////////
        const chatTemp = {
            date: Date.now(),
            message: Message,
            msgid: virId,
            refMsg: refData,
            userImg: User.UserPhoto,
            userName: User.fullName,
            userid: User.userid,
            username: User.username,
            stillSend: true
        }
        dispatch(Actions.type("setChatsTeam", {
            type: 'add',
            data: {
                key: chatIdStr,
                val: chatTemp
            }
        }));
        comonSound();
        HandelSendChat(text, file, recordFile, refMsg, virId);
    }, [teamName, mainSocket, chatIdStr]);
    //////////////////////////////////////////////
    const sendTyping = useCallback((action) => {
        mainSocket.emit("onTypingTeam", {
            type: action,
            teamName
        });
    }, [teamName]);
    //////////////////////////////////////////////
    const OnTyping = useTypingMeetoor({
        down: () => sendTyping(true),
        up: () => sendTyping(false)
    });
    //////////////////////////////////////////////
    const seenChat = useCallback(() => {
        mainSocket.emit("onChatTeamSeen", { isSeen: true, teamName });
    }, [teamName]);
    ///////////////////////////////////////////////
    useEffect(() => {
        seenChat();
    }, [teamName]);
    ////////////////////////////////////////
    useEffect(() => {
        let hrefID = teamName?.toLowerCase();
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case 'onChatTeamSeen':
                console.log(" onChatTeamSeen", data)
                if (data.teamname.toLowerCase() === hrefID)
                    setSeener(data.seens);
                break;
            default:
                break;
        }
    }, [socketLive]);
    ///////////////////////////////////////////////
    return (<>
        <TopSectionChatView teamid={teamid} teamName={teamName} teamPhoto={teamPhoto} />
        <RenderMeetoorChatBody teamName={teamName} />
        <SeenerChatView seener={seener} />
        <TabBarBottom isDark={isDark} height="auto"
            css={css`padding: ${pixel(2)};border-width: 0px;flex-direction: column;`}>
            <ContentEditableMain
                callBack={sendChats}
                idName={"chat"}
                placehold={placeholder.addMsg}
                onkeydown={OnTyping}
                onfocus={() => seenChat()}
                allowRecord={true}
                allowFile={true}
                autoFocus={false}
            />
        </TabBarBottom>
    </>)
}

export default memo(RenderMeetoorChatTeam);