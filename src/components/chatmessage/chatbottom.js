import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';
import { TabBarBottom } from '../home/helperhome';
import ContentEditableMain from '../../main/editable/editable';
import { css } from 'styled-components';
import { comonSound } from '../../sounds/sound';
import Axios from '../../main/Axios';
import useTypingMeetoor from '../home/helperchat/useTyping';
import { AnyText } from '../home/helperprefernce';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const BottomSectionChatView = ({ username, isFriend = true,
    sendTyping = () => null, fromStatus = false, callback }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const User = useSelector(state => state.main.user);
    const { placeholder, messages } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    //////////////////////////////////////////////
    const HandelSendChat = useCallback(async (text, file, recordFile, refMsg, virId) => {
        if (file || recordFile) {
            console.log("HandelSendChat ~ recordFile", recordFile)
            try {
                let data = new FormData();
                data.append('file', file ? file : recordFile);
                data.append('chatRecevier', username);
                //////////////////////////////////////////
                const response = await Axios.post("onChatFile/", data, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const chatFile = response.data.msgid;
                if (chatFile) mainSocket.emit("onChat", {
                    text, msgid: response.data.msgid,
                    to: username, record: recordFile ? true : false, virId
                });
            } catch (err) {
                console.log("HandelSendChat ~ err", err)
            }
        }
        else {
            mainSocket.emit("onChat", { text, to: username, refMsg: refMsg, virId });
        }
    }, [username, mainSocket, token]);
    //////////////////////////////////////////////
    const sendChats = useCallback((text, file, recordFile, refMsg, refData) => {
        if (!isFriend) return;
        text = fromStatus ? `$story$${text}` : text;
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
            seen: { isSeen: false },
            stillSend: true
        }
        dispatch(Actions.type("setChats", {
            type: 'add',
            data: {
                key: `chat_user_${username}`,
                val: chatTemp
            }
        }));
        comonSound();
        callback && callback();
        HandelSendChat(text, file, recordFile, refMsg, virId);
    }, [username, mainSocket, User, isFriend, token, fromStatus, callback]);
    //////////////////////////////////////////////
    const OnTyping = useTypingMeetoor({
        down: () => sendTyping(true),
        up: () => sendTyping(false)
    });
    //////////////////////////////////////////////
    const seenChat = useCallback(() => {
        mainSocket.emit("onChatSeen", { reciver: username });
    }, [username]);
    ///////////////////////////////////////////////
    useEffect(() => {
        seenChat();
    }, [username]);
    ///////////////////////////////////////////////
    return (<TabBarBottom isDark={fromStatus ? true : isDark} back={isFriend ? null : "red2"}
        alpha={isFriend ? 1 : 0.25} height="auto"
        css={css`padding: ${pixel(2)};border-width: 0px;flex-direction: column;`}>
        {isFriend ? <ContentEditableMain
            callBack={sendChats}
            idName={"chat"}
            forceDark={fromStatus}
            placehold={placeholder.addMsg}
            onkeydown={OnTyping}
            onfocus={() => seenChat()}
            allowRecord={!fromStatus}
            allowFile={!fromStatus}
            autoFocus={false}
        /> : <AnyText color="clr3" size={moderateScale(15)}>
            {messages.canotChat}
        </AnyText>}
    </TabBarBottom>)
}

export default memo(BottomSectionChatView);