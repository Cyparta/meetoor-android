import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { LiveSvg, ProfileSvg, SecureSvg, StarSvg, TeamsSvg } from '../../icons/all';
import { pixel } from '../../styles/basecss';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { OuterNameContent } from '../home/helpernotification/heplernotifycss';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { UserInfoModalTouch, ViewOuterCirculer } from '../home/sliderroom/helperroomcss';
////////////////////////////////////////////////////
export const ItemResult = memo(({ name, username, src,
    href, isSecure, isOwner, teamid }) => {
    let isTeam = (href === 'team');
    let value = isTeam ? teamid : username;
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////////////
    return (<UserInfoModalTouch isRTL={isRTL}
        back={isDark ? "clr3" : "back3"}
        onPress={() => navigate(href, { [isTeam ? "teamid" : "username"]: value })} activeOpacity={0.8}
        css={css`width: 100%;padding: 0 ${pixel(4)};margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
        <RenderAnyUserPhoto userPhoto={src} size={pixel(42)}
            renderBadge={<ViewOuterCirculer size={pixel(22)} back="clr1"
                css={css`position: absolute;left: 0px;bottom: 0px;`}>
                {isTeam ? <TeamsSvg color="back3" size={moderateScale(14)} /> :
                    isOwner ? <StarSvg color="back3" size={moderateScale(14)} /> : isSecure ?
                        <SecureSvg color="back3" size={moderateScale(14)} /> :
                        <ProfileSvg color="back3" size={moderateScale(14)} />}
            </ViewOuterCirculer>} />
        <OuterUserName isRTL={isRTL}>
            <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                color={isDark ? "back3" : "clr1"} lineH={pixel(16)}>{name}</AnyText>
            <OuterNameContent isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(11)}
                    color="clr2" lineH={pixel(13)} lower>
                    {username}
                </AnyText>
            </OuterNameContent>
        </OuterUserName>
    </UserInfoModalTouch>);
});
////////////////////////////////////////////////////
export const RoomResult = memo(({ roomid, fullName, userPhoto, header }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const callback = useCallback(() => mainSocket.emit("joinAudioRoom", { roomId: roomid }), [roomid]);
    ////////////////////////////////////////////////
    return (<UserInfoModalTouch isRTL={isRTL}
        back={isDark ? "clr3" : "back3"}
        onPress={null} activeOpacity={0.8}
        css={css`width: 100%;padding: 0 ${pixel(4)};margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
        <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(42)}
            renderBadge={<ViewOuterCirculer size={pixel(22)} back="red2"
                css={css`position: absolute;left: 0px;bottom: 0px;`}>
                <LiveSvg color="back3" size={moderateScale(18)} />
            </ViewOuterCirculer>} />
        <OuterUserName isRTL={isRTL}>
            <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                color={isDark ? "back3" : "clr1"} lineH={pixel(16)}>{fullName}</AnyText>
            <OuterNameContent isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(11)}
                    color="clr2" lineH={pixel(13)} lower numberOfLines={1}
                    ellipsizeMode="tail" width={"100%"}>
                    {header}
                </AnyText>
            </OuterNameContent>
        </OuterUserName>
    </UserInfoModalTouch>);
});
////////////////////////////////////////////////////
export const TrendResult = memo(({ hashtag = "", number = 0, addNum = null }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { messages, buttons } = useSelector(state => state.sign.langData);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////////////
    return (<UserInfoModalTouch isRTL={isRTL} back={isDark ? "clr3" : "back3"}
        onPress={() => navigate("trend", { hashtag })} activeOpacity={0.8}
        activeOpacity={0.8} css={css`width: 100%;padding: 0 ${pixel(4)};
        margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
        {addNum && <AnyText isRTL={isRTL} size={16} lower
            color={isDark ? "back3" : "clr1"}>
            {addNum}
        </AnyText>}
        <OuterUserName isRTL={isRTL}>
            <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                color={isDark ? "back3" : "clr1"} lineH={pixel(16)}>
                {"#"}{hashtag}
            </AnyText>
            <OuterNameContent isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(11)}
                    color="clr2" lineH={pixel(13)} lower numberOfLines={1}
                    ellipsizeMode="tail" width={"100%"}>
                    {messages.cited} {number} {buttons.posts}
                </AnyText>
            </OuterNameContent>
        </OuterUserName>
    </UserInfoModalTouch>);
});

