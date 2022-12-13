import React, { memo, useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    // ReplySvg,
    TeamsSvg,
} from "../../../icons/all";
import { AnyText, CircleStatus } from '../helperprefernce';
import Eye from "../../../icons/eye";
import {
    OuterOneImg, OuterOneType,
    OuterOneContent, OuterOneView,
    OuterOneBadges, OuterNameContent,
    // ReplyToMessage,
} from '../helpernotification/heplernotifycss';
import { RenderAnyUserPhoto } from '../helperhome';
import {
    EditableRender,
    Chat,
    Call,
    // Call
} from './helper';
// import Actions from '../../../reducer/actions';
import { useMemo } from 'react';
import { pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const OneOuterChat = ({
    photo,
    username,
    fullname,
    message,
    time = "a minute ago",
    type,
    isSeen,
    call = null,
    userid,
    isRead,
    msgId,
    isFriend,
    status = "offline",
    whoSent = { username: '', fullname: '' }
}) => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const lang = useSelector(state => state.sign.lang);
    const Time = useSelector(state => state.main.time);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const windowSize = useSelector(state => state.sign.windowSize);
    const openMoreWin = useSelector(state => state.main.openMoreWin);
    const User = useSelector(state => state.main.user);
    const mainSocket = useSelector(state => state.main.socket);
    const { callData, badges } = useSelector(state => state.sign.langData);
    ///////////////////////////////////////////////////////
    const [userState, setUserState] = useState({
        isFriend,
        status: status ? "online" : "offline"
    });
    ///////////////////////////////////////////////////////
    const localTime = Time.setDate(time, lang);
    const isMe = (whoSent.username === User.username);
    let who = isMe ? <>
        <AnyText small target lower
            color={isDark ? "back1" : "clr1"}>{callData.you}</AnyText>
        <AnyText small target lower
            color={isDark ? "back1" : "clr1"}
            isRTL={!isRTL} autoMargin={pixel(4)}>:</AnyText>
    </> : type ? <AnyText small target lower /> : <>
        <AnyText small target lower
            color={isDark ? "back1" : "clr1"}>{whoSent.fullname}</AnyText>
        <AnyText small target
            color={isDark ? "back1" : "clr1"}
            isRTL={!isRTL} autoMargin={pixel(4)} lower>:</AnyText>
    </>;
    ///////////////////////////////////////////////////////
    const makeRead = useCallback(() => {
        !isRead && mainSocket.emit("updateMessage", { msgId });
    }, [isRead, msgId]);
    ///////////////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "updateStatus":
                (userid === data.userid) && setUserState(last => {
                    return {
                        ...last,
                        status: data.status ? "online" : "offline"
                    }
                });
                break;
            default:
                break;
        }
    }, [socketLive]);
    //////////////////////////////////////////////////////
    const CircleStatusRender = useMemo(() => {
        if (type) {
            if (User.status) return <OuterOneType isRTL={isRTL}>
                <CircleStatus color={userState.status} />
            </OuterOneType>;
            return null;
        } else {
            return <OuterOneType isRTL={isRTL}>
                <TeamsSvg color="back3" size={moderateScale(16)} />
            </OuterOneType>;
        }
    }, [userState, type, isRTL, User]);
    ///////////////////////////////////////////////////////
    return (<>
        <OuterOneView
            activeOpacity={0.9}
            isRTL={isRTL} onPress={() => {
                makeRead();
                let nav = type ? "chat" : "teamchat";
                let params = type ? { username, status: userState.status } : { teamName: username, teamPhoto: photo, teamid: userid }
                navigate(nav, params);
            }}>
            <OuterOneImg>
                <RenderAnyUserPhoto userPhoto={photo} size={pixel(45)} />
                {CircleStatusRender}
            </OuterOneImg>
            <OuterOneContent isRTL={isRTL}
                width={parseInt(windowSize.width - moderateScale(55)) + "px"}>
                <OuterNameContent isRTL={isRTL}>
                    <AnyText target lower isRTL={isRTL}
                        color={isDark ? "back1" : "clr1"}>{fullname}</AnyText>
                    {!type || isMe ? <Eye seen={isSeen} isDark={isDark} /> : <AnyText target>{" - "}</AnyText>}
                    {/* {(userState.isFriend && type) || !type ? <ReplyToMessage acc
                        onPress={() => dispatch(Actions.type("setOpenMoreWin", openMoreWin === username ? false : username))}>
                        <ReplySvg forceDark size={moderateScale(14)} />
                    </ReplyToMessage> : null} */}
                    {localTime && <AnyText lower target
                        color={isDark ? "clr2" : "clr4"}>{localTime.toNow}</AnyText>}
                </OuterNameContent>

                <OuterNameContent isRTL={isRTL} width={"100%"}>
                    {call !== null ?
                        <Call call={call} who={who} isRTL={isRTL} /> :
                        <Chat width={windowSize.width} isDark={isDark}
                            text={message} who={who} isRTL={isRTL} />}
                </OuterNameContent>
                {/* {localTime && <AnyText target lower color="clr2">{localTime.toNow}</AnyText>} */}
            </OuterOneContent>
            <OuterOneBadges isRead={isRead} isRTL={isRTL} isDark={isDark}
                width={windowSize.width} transation="left">
                <AnyText target lower color={isDark ? "clr1" : "back1"}>{badges.new}</AnyText>
            </OuterOneBadges>
        </OuterOneView>
        {openMoreWin === username ? <EditableRender username={username} fullname={fullname}
            type={type} opnner={openMoreWin === username} photo={photo} /> : null}
    </>)
}

export default memo(OneOuterChat);