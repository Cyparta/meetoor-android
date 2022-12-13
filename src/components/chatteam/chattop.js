import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../styles/basecss';
import { OuterPostTop } from '../posts/posts/post/helperpostcss';
import { UserInfoModalTouch } from '../home/sliderroom/helperroomcss';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { OuterNameContent } from '../home/helpernotification/heplernotifycss';
import { BarIndicator } from 'react-native-indicators';
// import Actions from '../../reducer/actions';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const TopSectionChatView = ({ teamName, teamid, teamPhoto }) => {
    console.log("TopSectionChatView ~ teamid", teamid)
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    const typingSocket = useSelector(state => state.socket.typingSocket);
    const When = useSelector(state => state.main.when);
    ////////////////////////////////////////
    const [typing, setTyping] = useState(false);
    ////////////////////////////////////////
    const GoToTeam = useCallback(() => {
        navigate("team", { teamid });
    }, [navigate, teamid]);
    ////////////////////////////////////////
    useEffect(() => {
        let hrefID = teamName?.toLowerCase();
        const { event, data, when } = typingSocket;
        if (when >= When()) switch (event) {
            case 'onTypingTeam':
                if (data.teamname.toLowerCase() === hrefID)
                    setTyping(data.type);
                break;
            default:
                break;
        }
    }, [typingSocket]);
    ///////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL} isDark={isDark}
        css={css`border-bottom-width: ${pixel(1)};border-top-width: ${pixel(1)};
            border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};border-radius: 0px;
            min-height: ${pixel(45)};max-height: ${pixel(45)};padding: 0 ${pixel(4)};`}>
        <UserInfoModalTouch isRTL={isRTL} activeOpacity={1}
            css={css`width: 100%;flex: 1;`} onPress={GoToTeam}>
            <RenderAnyUserPhoto userPhoto={teamPhoto} size={pixel(40)} />
            <OuterUserName isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color={isDark ? "back3" : "clr1"} lineH={pixel(16)}>{teamName}</AnyText>
                <OuterNameContent isRTL={isRTL}>
                    {typing ? <BarIndicator size={moderateScale(12)} count={7}
                        color={colors[isDark ? "back2" : "clr2"]} /> : null}
                </OuterNameContent>
            </OuterUserName>
        </UserInfoModalTouch>
    </OuterPostTop>)
}

export default memo(TopSectionChatView);