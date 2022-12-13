import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    PinControlSvg,
    SecureSvg, MoreSvg, StarSvg,
    SavedSvg, EditPenSvg, SharedSvg,
    FriendsSvg, FollowersSvg, TeamsSvg
} from '../../../../icons/all';
import { AnyText, OuterUserName } from '../../../home/helperprefernce';
import { ButtonCirculer, UserInfoModalTouch, ViewOuterCirculer } from '../../../home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../../../home/helperhome';
import Actions from '../../../../reducer/actions';
import { css } from 'styled-components';
import { OuterNameContent } from '../../../home/helpernotification/heplernotifycss';
import { colors, pixel, Rgba } from '../../../../styles/basecss';
import { InnerPadgesPost, OnePadgePost, OuterPadgesPost, OuterPostTop } from './helperpostcss';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////////
const OnePostTop = ({
    postText,
    keyArray,
    posterPhoto,
    posterName,
    posterUsername,
    postId,
    date,
    background,
    isUser = true,
    isSaved,
    secure,
    teamid,
    isFriend,
    isFollowing,
    isOwner = false,
    isSecure = false,
    info,
    isEdit,
    refId,
    isPin,
    pinned,
    isMe,
    fromVideo = false,
    noAction
}) => {
    const dispatch = useDispatch();
    const lang = useSelector(state => state.sign.lang);
    const Time = useSelector(state => state.main.time);
    const localTime = Time.setDate(date, lang);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const GoToProfile = useCallback(() => {
        if (isUser) navigate("profile", { username: posterUsername });
        else navigate("team", { teamid });
    }, [navigate, posterUsername, isUser, teamid]);
    const forceDark = useMemo(() => fromVideo ? true : isDark, [fromVideo, isDark]);
    /////////////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL}
        css={css`border-bottom-width: ${pixel(fromVideo ? 0 : 1)};
            border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};
            ${fromVideo ? "border-radius: 0;" : null};`}
        isDark={forceDark}>
        <UserInfoModalTouch isRTL={isRTL} onPress={GoToProfile}
            activeOpacity={0.8} css={css`width: 100%;flex: 1;`}>
            <RenderAnyUserPhoto userPhoto={posterPhoto} size={pixel(40)}
                renderBadge={isSecure ? <ViewOuterCirculer
                    size={pixel(23)} back="clr1" css={css`position: absolute;
                    left: ${pixel(-2)};bottom: ${pixel(2)};`}>
                    {(isOwner && isUser) ?
                        <StarSvg color="back3" size={moderateScale(14)} /> :
                        <SecureSvg color="back3" size={moderateScale(14)} />}
                </ViewOuterCirculer> : null} />
            <OuterUserName isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(12)} lower lineH={pixel(16)}
                    color={forceDark ? "back3" : "clr1"}>{posterName}</AnyText>
                <OuterNameContent isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(10)}
                        color={forceDark ? "back2" : "clr4"} lineH={pixel(12)} lower>
                        {isUser ? `@${posterUsername}` : `@${info}`}
                    </AnyText>
                    {noAction ? null : <>
                        <AnyText isRTL={isRTL} size={moderateScale(10)}
                            color="clr2" lineH={pixel(12)} lower>
                            {" - "}
                        </AnyText>
                        <AnyText isRTL={isRTL} size={moderateScale(10)}
                            color="clr2" lineH={pixel(12)} lower>
                            {localTime.ago}
                        </AnyText>
                    </>}
                </OuterNameContent>
            </OuterUserName>
        </UserInfoModalTouch>
        {noAction ? null : <ButtonCirculer isRTL={isRTL} size={pixel(28)} activeOpacity={0.8}
            onPress={() => dispatch(Actions.
                type("setCurrentModalWithNav", {
                    key: "postmore", isMe, isPin, isSaved, posterName, secure,
                    postText, keyArray, postId, background, posterUsername, fromVideo
                }))}
            css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
            <MoreSvg forceDark={forceDark} size={moderateScale(13)} rot={90} />
        </ButtonCirculer>}
        {noAction ? null : <OuterPadgesPost>
            <InnerPadgesPost>
                {pinned || isPin ? <OnePadgePost>
                    <PinControlSvg color="back3" size={moderateScale(14)} type={true} />
                </OnePadgePost> : null}
                {isSaved ? <OnePadgePost>
                    <SavedSvg color="back3" size={moderateScale(14)} />
                </OnePadgePost> : null}
                {isEdit ? <OnePadgePost>
                    <EditPenSvg color="back3" size={moderateScale(14)} />
                </OnePadgePost> : null}

                {refId ? <OnePadgePost>
                    <SharedSvg color="back3" size={moderateScale(14)} />
                </OnePadgePost> : null}
                {isUser ? <>
                    {isFriend ? <OnePadgePost>
                        <FriendsSvg color="back3" size={moderateScale(14)} />
                    </OnePadgePost> : null}
                    {isFollowing ? <OnePadgePost>
                        <FollowersSvg color="back3" size={moderateScale(14)} />
                    </OnePadgePost> : null}
                </> :
                    <OnePadgePost>
                        <TeamsSvg color="back3" size={moderateScale(14)} />
                    </OnePadgePost>
                }
            </InnerPadgesPost>
        </OuterPadgesPost>}
    </OuterPostTop>);
}
//////////////////////////////////////////////////////
export default memo(OnePostTop);