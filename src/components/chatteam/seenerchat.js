import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../styles/basecss';
import { OuterPostTop } from '../posts/posts/post/helperpostcss';
import { UserInfoModalTouch } from '../home/sliderroom/helperroomcss';
import { AnyText } from '../home/helperprefernce';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const SeenerChatView = ({ seener }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    const windowSize = useSelector(state => state.sign.windowSize);
    ////////////////////////////////////////
    const [lengthForSeen, setLengthForSeen] = useState(10);
    ////////////////////////////////////////
    useEffect(() => {
        const refWidth = windowSize.width;
        const length = parseInt(refWidth / moderateScale(20));
        setLengthForSeen(length);
    }, [windowSize.width]);
    ///////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL} isDark={isDark}
        css={css`border-bottom-width: ${pixel(1)};border-top-width: ${pixel(1)};
            border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};border-radius: 0px;
            min-height: ${pixel(25)};max-height: ${pixel(22)};padding: 0 ${pixel(4)};`}>
        <UserInfoModalTouch isRTL={isRTL}
            onPress={() => {
                seener.length && navigate("chatteamseener", { currentSeener: seener })
            }}
            activeOpacity={0.8} css={css`width: 100%;flex: 1;`}>
            {(lengthForSeen && seener.length) ? seener.slice(0, lengthForSeen)
                .map(({ userphoto, username }, i) => {
                    return (<RenderAnyUserPhoto key={username + "_seen" + i}
                        userPhoto={userphoto} size={pixel(20)} />)
                }) : null}
            {(seener.length - lengthForSeen) > 0 ?
                <AnyText color="back2" size={moderateScale(12)} lineH={pixel(14)} lower
                    css={css`opacity: 0.9;position: absolute;right: 0;border-radius: 4px;
                        background: ${colors["clr1"]};padding: ${pixel(2)};`}>
                    +{seener.length - lengthForSeen}
                </AnyText> : null}
        </UserInfoModalTouch>
    </OuterPostTop>)
}

export default memo(SeenerChatView);