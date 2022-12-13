import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../styles/basecss';
import { MoreSvg, PhoneSvg } from '../../icons/all';
import { OuterPostTop } from '../posts/posts/post/helperpostcss';
import { ButtonCirculer, UserInfoModalTouch, ViewOuterCirculer } from '../home/sliderroom/helperroomcss';
import { AnyText, CircleStatus, OuterUserName } from '../home/helperprefernce';
import { OuterNameContent } from '../home/helpernotification/heplernotifycss';
import { BarIndicator } from 'react-native-indicators';
import Actions from '../../reducer/actions';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const TopSectionChatView = ({ username, photo, fullname, userid, status }) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const typingSocket = useSelector(state => state.socket.typingSocket);
    const When = useSelector(state => state.main.when);
    const { navigate } = useSelector(state => state.modal.navigation);
    const User = useSelector(state => state.main.user);
    ///////////////////////////////////////
    const [userState, setUserState] = useState(status);
    ////////////////////////////////////////
    const GoToProfile = useCallback(() => {
        navigate("profile", { username });
    }, [navigate, username]);
    ////////////////////////////////////////
    const [typing, setTyping] = useState(false);
    ////////////////////////////////////////
    useEffect(() => {
        let hrefID = username?.toLowerCase();
        const { event, data, when } = typingSocket;
        if (when >= When()) switch (event) {
            case 'onTyping':
                if (data.username.toLowerCase() === hrefID)
                    setTyping(data.type);
                break;
            default:
                break;
        }
    }, [typingSocket]);
    ////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "updateStatus":
                (userid === data.userid) && setUserState(data.status ? "online" : "offline");
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OpenMoreModal = useCallback(() => {
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "chatmore", username, callbackDelete: () => {
                dispatch(Actions.type("setChats", {
                    type: 'set',
                    data: {
                        key: `chat_user_${username}`,
                        val: []
                    }
                }));
                dispatch(Actions.type("setMessages", {
                    type: 'delete',
                    data: {
                        target: username,
                        key: "username"
                    }
                }));
            }
        }))
    }, [username]);
    ///////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL} isDark={isDark}
        css={css`border-bottom-width: ${pixel(1)};border-top-width: ${pixel(1)};
            border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};border-radius: 0px;
            min-height: ${pixel(45)};max-height: ${pixel(45)};padding: 0 ${pixel(4)};`}>
        <UserInfoModalTouch isRTL={isRTL} onPress={GoToProfile}
            activeOpacity={0.8} css={css`width: 100%;flex: 1;`}>
            <RenderAnyUserPhoto userPhoto={photo} size={pixel(40)}
                renderBadge={User.status ? <ViewOuterCirculer
                    size={pixel(16)} back="clr1" css={css`position: absolute;
                    left: ${pixel(0)};bottom: ${pixel(2)};`}>
                    <CircleStatus color={userState} />
                </ViewOuterCirculer> : null} />
            <OuterUserName isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color={isDark ? "back3" : "clr1"} lineH={pixel(16)}>{fullname}</AnyText>
                <OuterNameContent isRTL={isRTL}>
                    {typing ? <BarIndicator size={moderateScale(12)} count={7}
                        color={colors[isDark ? "back2" : "clr2"]} /> :
                        <AnyText isRTL={isRTL} size={moderateScale(11)}
                            color="clr2" lineH={pixel(12)} lower>
                            {"@"}{username}
                        </AnyText>}
                </OuterNameContent>
            </OuterUserName>
        </UserInfoModalTouch>
        <ButtonCirculer isRTL={isRTL} size={pixel(30)} activeOpacity={0.8}
            css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
            <PhoneSvg size={moderateScale(20)} color={isDark ? "back2" : "clr2"} />
        </ButtonCirculer>
        <ButtonCirculer isRTL={isRTL} size={pixel(30)} activeOpacity={0.8}
            onPress={OpenMoreModal}
            css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
            <MoreSvg size={moderateScale(18)} rot={90} />
        </ButtonCirculer>
    </OuterPostTop>)
}

export default memo(TopSectionChatView);