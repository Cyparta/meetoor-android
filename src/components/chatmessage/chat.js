import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../../main/Axios';
import TopSectionChatView from './chattop';
import BottomSectionChatView from './chatbottom';
import useGoBack from "../../main/goback";
import Actions from '../../reducer/actions';
import RenderMeetoorChatBody from './chatbody';
///////////////////////////////////////////////////
const RenderMeetoorChatMessage = ({ username, status = "offline" }) => {
    const dispatch = useDispatch();
    const handleBack = useGoBack();
    const mainSocket = useSelector(state => state.main.socket);
    const token = useSelector(state => state.sign.token);
    const chatUsers = useSelector(state => state.profile.chatUsers);
    const chatUser = chatUsers[username];
    //////////////////////////////////////////////
    const sendTyping = useCallback((action) => {
        mainSocket.emit("onTyping", {
            type: action,
            to: username
        });
    }, [username]);
    //////////////////////////////////////////////
    const getUserChatApi = useCallback(async () => {
        try {
            const response = await Axios.get(`userData/?username=${username}&anony`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            console.log("getUserChatApi ~ responseData", responseData)
            if (!responseData) {
                handleBack();
                return;
            }
            dispatch(Actions.type("setChatUsers", {
                type: "add",
                data: {
                    key: username,
                    val: responseData
                }
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [username, handleBack]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (chatUser === undefined);
        if (checker) getUserChatApi();
    }, [chatUser]);
    ///////////////////////////////////////////////
    return (<>
        <TopSectionChatView {...(chatUser || {})} status={status} />
        <RenderMeetoorChatBody username={username} name={chatUser?.fullname} />
        <BottomSectionChatView sendTyping={sendTyping}
            username={username} isFriend={chatUser?.isFriend} />
    </>)
}

export default memo(RenderMeetoorChatMessage);